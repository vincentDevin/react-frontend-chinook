import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { trackApi, artistApi, albumApi, mediaTypeApi, genreApi } from '../../api/entitiesApi'; // Import genreApi
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import { getUserRoleFromToken } from '../../api/authUtils';

const TrackForm = () => {
    const params = useParams();
    const trackId = params.trackId ? parseInt(params.trackId, 10) : 0;
    const navigate = useNavigate();

    const [artists, setArtists] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]); // State for genres
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiErrors, setApiErrors] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    const artistLimit = 50;

    // Validation schema for the track form
    const trackValidationSchema = Yup.object().shape({
        Name: Yup.string()
            .required('Track name is required')
            .min(2, 'Track name must be at least 2 characters')
            .max(100, 'Track name must be at most 100 characters'),
        Composer: Yup.string()
            .min(2, 'Composer must be at least 2 characters')
            .max(100, 'Composer must be at most 100 characters'),
        Milliseconds: Yup.number()
            .min(1, 'Duration must be positive')
            .max(600000, 'Duration cannot exceed 10 minutes')
            .required('Duration is required'),
        Bytes: Yup.number()
            .required('Bytes are required'),
        UnitPrice: Yup.number()
            .min(0.01, 'Price must be at least 0.01')
            .max(999.99, 'Price cannot exceed $999.99')
            .required('Price is required'),
        ArtistId: Yup.number().required('Artist is required'),
        AlbumId: Yup.number().required('Album is required'),
        MediaTypeId: Yup.number().required('Media Type is required'),
        GenreId: Yup.number().required('Genre is required'),
    });

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
        resolver: yupResolver(trackValidationSchema),
    });

    const selectedArtist = watch('ArtistId'); // Watch for changes in ArtistId

    // Fetch albums based on the selected artist
    const fetchAlbums = async (artistId) => {
        try {
            const response = await albumApi.getAllByArtistId(artistId);
            setAlbums(response || []);
        } catch (error) {
            console.error('Error fetching albums:', error.message);
        }
    };

    // Load artists, genres, media types, and track data
    useEffect(() => {
        const loadArtistsAndTrackData = async () => {
            try {
                setLoading(true);
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }
        
                const artistResponse = await artistApi.getAll({ page: 1, limit: artistLimit });
                setArtists(artistResponse.artists || []);
        
                const mediaTypeResponse = await mediaTypeApi.getAll();
                setMediaTypes(mediaTypeResponse.mediaTypes || []);
        
                // Fetch genres: adjust depending on API response structure
                const genreResponse = await genreApi.getAll(); 
                // Check if the response is an array or has a genres key
                setGenres(Array.isArray(genreResponse) ? genreResponse : genreResponse.genres);
        
                // If editing, load the track data and albums for the selected artist
                if (trackId > 0) {
                    const track = await trackApi.getById(trackId);
                    setValue('Name', track.Name);
                    setValue('Composer', track.Composer);
                    setValue('Milliseconds', track.Milliseconds);
                    setValue('Bytes', track.Bytes);
                    setValue('UnitPrice', parseFloat(track.UnitPrice));
                    setValue('ArtistId', track.ArtistId);
                    setValue('AlbumId', track.AlbumId);
                    setValue('MediaTypeId', track.MediaTypeId);
                    setValue('GenreId', track.GenreId);
                    await fetchAlbums(track.ArtistId);
                }
            } finally {
                setLoading(false);
            }
        };        
        loadArtistsAndTrackData();
    }, [trackId, setValue, artistLimit]);

    // Fetch albums whenever the selected artist changes
    useEffect(() => {
        if (selectedArtist) {
            fetchAlbums(selectedArtist); // Fetch albums when the artist changes
            setValue('AlbumId', ''); // Reset album selection when artist changes
        }
    }, [selectedArtist, setValue]);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete tracks.');
            return;
        }

        const action = trackId > 0 ? trackApi.update : trackApi.insert;
        const requestData = { ...data, TrackId: trackId };

        try {
            await action(requestData);
            navigate('/tracks'); // Redirect to tracks list on success
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setApiErrors(err.response.data.errors);
            } else {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading form data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>{trackId > 0 ? 'Edit Track' : 'Add New Track'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="Name"
                            label="Track Name"
                            register={register}
                            error={errors.Name || apiErrors.Name}
                        />
                        <InputField
                            id="Composer"
                            label="Composer"
                            register={register}
                            error={errors.Composer || apiErrors.Composer}
                        />
                        <InputField
                            id="Milliseconds"
                            label="Duration (ms)"
                            type="number"
                            register={register}
                            error={errors.Milliseconds || apiErrors.Milliseconds}
                        />
                        <InputField
                            id="Bytes"
                            label="Bytes"
                            type="number"
                            register={register}
                            error={errors.Bytes || apiErrors.Bytes}
                        />
                        <InputField
                            id="UnitPrice"
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            register={register}
                            error={errors.UnitPrice || apiErrors.UnitPrice}
                        />

                        {/* Artist Select */}
                        <div className="mb-3">
                            <label htmlFor="ArtistId" className="form-label">Artist</label>
                            <select {...register('ArtistId')}>
                                <option value="">Select Artist</option>
                                {artists.map((artist) => (
                                    <option key={artist.ArtistId} value={artist.ArtistId}>
                                        {artist.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.ArtistId && <div className="text-danger">{errors.ArtistId.message}</div>}
                        </div>

                        {/* Album Select */}
                        <div className="mb-3">
                            <label htmlFor="AlbumId" className="form-label">Album</label>
                            <select {...register('AlbumId')}>
                                <option value="">Select Album</option>
                                {albums.map((album) => (
                                    <option key={album.AlbumId} value={album.AlbumId}>
                                        {album.Title}
                                    </option>
                                ))}
                            </select>
                            {errors.AlbumId && <div className="text-danger">{errors.AlbumId.message}</div>}
                        </div>

                        {/* Media Type Select */}
                        <div className="mb-3">
                            <label htmlFor="MediaTypeId" className="form-label">Media Type</label>
                            <select {...register('MediaTypeId')}>
                                <option value="">Select Media Type</option>
                                {mediaTypes.map((mediaType) => (
                                    <option key={mediaType.MediaTypeId} value={mediaType.MediaTypeId}>
                                        {mediaType.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.MediaTypeId && <div className="text-danger">{errors.MediaTypeId.message}</div>}
                        </div>

                        {/* Genre Select */}
                        <div className="mb-3">
                            <label htmlFor="GenreId" className="form-label">Genre</label>
                            <select {...register('GenreId')}>
                                <option value="">Select Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre.GenreId} value={genre.GenreId}>
                                        {genre.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.GenreId && <div className="text-danger">{errors.GenreId.message}</div>}
                        </div>

                        {isAdmin && <FormButtons onCancel={() => navigate('/tracks')} />}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrackForm;
