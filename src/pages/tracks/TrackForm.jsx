import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { trackApi, artistApi, albumApi, mediaTypeApi, genreApi } from '../../api/entitiesApi'; 
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import SelectField from '../../components/SelectField';
import { getUserRoleFromToken } from '../../api/authUtils';

const TrackForm = () => {
    const params = useParams();
    const trackId = params.trackId ? parseInt(params.trackId, 10) : 0;
    const navigate = useNavigate();

    const [artists, setArtists] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiErrors, setApiErrors] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [track, setTrack] = useState(null); // Store the fetched track for editing

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
        Bytes: Yup.number().required('Bytes are required'),
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

    const selectedArtist = watch('ArtistId');

    // Map values by name and find corresponding ID
    const findIdByName = (options, name, key = 'label') => {
        const option = options.find(opt => opt[key] === name);
        return option ? option.value : null;
    };

    const fetchAlbums = async (artistId) => {
        if (!artistId || isNaN(artistId)) return;
        try {
            const response = await albumApi.getAllByArtistId(artistId);
            setAlbums(response || []);
        } catch (error) {
            console.error('Error fetching albums:', error.message);
        }
    };

    useEffect(() => {
        const loadArtistsAndTrackData = async () => {
            try {
                setLoading(true);
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                // Fetch the lists of artists, media types, and genres
                const artistResponse = await artistApi.getAll({ page: 1, limit: artistLimit });
                const mediaTypeResponse = await mediaTypeApi.getAll();
                const genreResponse = await genreApi.getAll();

                setArtists(artistResponse.artists || []);
                setMediaTypes(mediaTypeResponse.mediaTypes || []);
                setGenres(Array.isArray(genreResponse) ? genreResponse : genreResponse.genres || []);

                if (trackId > 0) {
                    // Fetch track by ID
                    const track = await trackApi.getById(trackId);
                    setTrack(track);

                    // Map names to their respective IDs for pre-selecting values
                    const artistId = findIdByName(
                        artistResponse.artists.map(artist => ({ value: artist.ArtistId, label: artist.Name })),
                        track.ArtistName
                    );
                    const albumId = findIdByName(
                        (await albumApi.getAllByArtistId(artistId)).map(album => ({ value: album.AlbumId, label: album.Title })),
                        track.AlbumTitle
                    );
                    const mediaTypeId = findIdByName(
                        mediaTypeResponse.mediaTypes.map(mediaType => ({ value: mediaType.MediaTypeId, label: mediaType.Name })),
                        track.MediaTypeName
                    );
                    const genreId = findIdByName(
                        genreResponse.map(genre => ({ value: genre.GenreId, label: genre.Name })),
                        track.GenreName
                    );

                    // Set default values
                    setValue('Name', track.Name);
                    setValue('Composer', track.Composer);
                    setValue('Milliseconds', track.Milliseconds);
                    setValue('Bytes', track.Bytes);
                    setValue('UnitPrice', parseFloat(track.UnitPrice));
                    setValue('ArtistId', artistId);
                    setValue('AlbumId', albumId);
                    setValue('MediaTypeId', mediaTypeId);
                    setValue('GenreId', genreId);

                    await fetchAlbums(artistId);
                }
            } finally {
                setLoading(false);
            }
        };

        loadArtistsAndTrackData();
    }, [trackId, setValue, artistLimit]);

    useEffect(() => {
        if (selectedArtist && !isNaN(selectedArtist)) {
            fetchAlbums(selectedArtist);
            setValue('AlbumId', ''); 
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
            navigate('/tracks');
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

                        <SelectField
                            id="ArtistId"
                            label="Artist"
                            options={artists.map(artist => ({ value: artist.ArtistId, label: artist.Name }))}
                            register={register}
                            error={errors.ArtistId}
                            defaultValue={track?.ArtistId || ''}
                        />

                        <SelectField
                            id="AlbumId"
                            label="Album"
                            options={albums.map(album => ({ value: album.AlbumId, label: album.Title }))}
                            register={register}
                            error={errors.AlbumId}
                            defaultValue={track?.AlbumId || ''}
                        />

                        <SelectField
                            id="MediaTypeId"
                            label="Media Type"
                            options={mediaTypes.map(mediaType => ({ value: mediaType.MediaTypeId, label: mediaType.Name }))}
                            register={register}
                            error={errors.MediaTypeId}
                            defaultValue={track?.MediaTypeId || ''}
                        />

                        <SelectField
                            id="GenreId"
                            label="Genre"
                            options={genres.map(genre => ({ value: genre.GenreId, label: genre.Name }))}
                            register={register}
                            error={errors.GenreId}
                            defaultValue={track?.GenreId || ''}
                        />

                        {isAdmin && <FormButtons onCancel={() => navigate('/tracks')} />}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrackForm;
