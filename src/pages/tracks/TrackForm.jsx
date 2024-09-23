import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { trackApi } from '../../api/entitiesApi';
import * as Yup from 'yup';

const TrackForm = () => {
    const params = useParams();
    const trackId = params.trackId || 0;
    const navigate = useNavigate();

    const trackValidationSchema = Yup.object().shape({
        name: Yup.string().required('Track name is required'),
        album: Yup.string().required('Album is required'),
        genre: Yup.string().required('Genre is required'),
        mediaType: Yup.string().required('Media type is required'),
        milliseconds: Yup.number()
            .min(1, 'Duration must be positive')
            .required('Duration is required'),
        price: Yup.number().min(0.01, 'Price must be at least 0.01').required('Price is required'),
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
        if (trackId > 0) {
            trackApi.getById(trackId).then((track) => {
                setValue('name', track.name);
                setValue('album', track.album);
                setValue('genre', track.genre);
                setValue('mediaType', track.mediaType);
                setValue('milliseconds', track.milliseconds);
                setValue('price', track.price);
            });
        }
    }, [trackId, setValue]);

    const onSubmit = (data) => {
        const action = trackId > 0 ? trackApi.update : trackApi.insert;
        const requestData = trackId > 0 ? { ...data, id: trackId } : data;
        action(requestData).then(() => navigate('/tracks'));
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>{trackId > 0 ? 'Edit Track' : 'Add New Track'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <div className="mb-3">
                            <label htmlFor="trackName" className="form-label">
                                Track Name:
                            </label>
                            <input
                                type="text"
                                id="trackName"
                                className="form-control"
                                {...register('name')}
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            {errors.name && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="trackAlbum" className="form-label">
                                Album:
                            </label>
                            <input
                                type="text"
                                id="trackAlbum"
                                className="form-control"
                                {...register('album')}
                                aria-invalid={errors.album ? 'true' : 'false'}
                            />
                            {errors.album && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.album.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="trackGenre" className="form-label">
                                Genre:
                            </label>
                            <input
                                type="text"
                                id="trackGenre"
                                className="form-control"
                                {...register('genre')}
                                aria-invalid={errors.genre ? 'true' : 'false'}
                            />
                            {errors.genre && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.genre.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="trackMediaType" className="form-label">
                                Media Type:
                            </label>
                            <input
                                type="text"
                                id="trackMediaType"
                                className="form-control"
                                {...register('mediaType')}
                                aria-invalid={errors.mediaType ? 'true' : 'false'}
                            />
                            {errors.mediaType && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.mediaType.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="trackMilliseconds" className="form-label">
                                Duration (ms):
                            </label>
                            <input
                                type="number"
                                id="trackMilliseconds"
                                className="form-control"
                                {...register('milliseconds')}
                                aria-invalid={errors.milliseconds ? 'true' : 'false'}
                                aria-describedby="durationHelp"
                            />
                            <small id="durationHelp" className="form-text text-muted">
                                Enter the duration in milliseconds.
                            </small>
                            {errors.milliseconds && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.milliseconds.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="trackPrice" className="form-label">
                                Price ($):
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="trackPrice"
                                className="form-control"
                                {...register('price')}
                                aria-invalid={errors.price ? 'true' : 'false'}
                            />
                            {errors.price && (
                                <div className="text-danger" aria-live="polite">
                                    {errors.price.message}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success">
                            SAVE
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate('/tracks')}
                        >
                            CANCEL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrackForm;
