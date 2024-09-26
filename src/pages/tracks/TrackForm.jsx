import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { trackApi, albumApi, genreApi, mediaTypeApi } from '../../api/entitiesApi';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import FormButtons from '../../components/FormButtons';

const TrackForm = () => {
    const params = useParams();
    const trackId = params.trackId ? parseInt(params.trackId, 10) : 0;
    const navigate = useNavigate();

    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const trackValidationSchema = Yup.object().shape({
        Name: Yup.string().required('Track name is required'),
        AlbumId: Yup.number().required('Album ID is required').positive('Album ID must be positive'),
        GenreId: Yup.number().required('Genre ID is required').positive('Genre ID must be positive'),
        MediaTypeId: Yup.number().required('Media type ID is required').positive('Media type ID must be positive'),
        Milliseconds: Yup.number().min(1, 'Duration must be positive').required('Duration is required'),
        UnitPrice: Yup.number().min(0.01, 'Price must be at least 0.01').required('Price is required'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(trackValidationSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumsData, genresData, mediaTypesData] = await Promise.all([
                    albumApi.getAll(),
                    genreApi.getAll(),
                    mediaTypeApi.getAll(),
                ]);

                setAlbums(albumsData);
                setGenres(genresData);
                setMediaTypes(mediaTypesData);

                if (trackId > 0) {
                    const track = await trackApi.getById(trackId);
                    setValue('Name', track.Name);
                    setValue('AlbumId', track.AlbumId);
                    setValue('GenreId', track.GenreId);
                    setValue('MediaTypeId', track.MediaTypeId);
                    setValue('Milliseconds', track.Milliseconds);
                    setValue('UnitPrice', parseFloat(track.UnitPrice));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [trackId, setValue]);

    const onSubmit = (data) => {
        const action = trackId > 0 ? trackApi.update : trackApi.insert;
        const requestData = trackId > 0 ? { ...data, TrackId: trackId } : data;

        action(requestData)
            .then(() => navigate('/tracks'))
            .catch((err) => setError(err.message));
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
                            error={errors.Name}
                        />
                        <SelectField
                            id="AlbumId"
                            label="Album"
                            options={albums.map((album) => ({
                                value: album.AlbumId,
                                label: album.Title,
                            }))}
                            register={register}
                            error={errors.AlbumId}
                        />
                        <SelectField
                            id="GenreId"
                            label="Genre"
                            options={genres.map((genre) => ({
                                value: genre.GenreId,
                                label: genre.Name,
                            }))}
                            register={register}
                            error={errors.GenreId}
                        />
                        <SelectField
                            id="MediaTypeId"
                            label="Media Type"
                            options={mediaTypes.map((mediaType) => ({
                                value: mediaType.MediaTypeId,
                                label: mediaType.Name,
                            }))}
                            register={register}
                            error={errors.MediaTypeId}
                        />
                        <InputField
                            id="Milliseconds"
                            label="Duration (ms)"
                            type="number"
                            register={register}
                            error={errors.Milliseconds}
                            aria-describedby="durationHelp"
                        />
                        <small id="durationHelp" className="form-text text-muted">
                            Enter the duration in milliseconds.
                        </small>
                        <InputField
                            id="UnitPrice"
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            register={register}
                            error={errors.UnitPrice}
                        />

                        <FormButtons onCancel={() => navigate('/tracks')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrackForm;
