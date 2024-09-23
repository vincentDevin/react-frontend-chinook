import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import albumValidationSchema from '../../validation/albumValidationSchema';

const AlbumForm = () => {
    const params = useParams();
    const albumId = params.albumId || 0;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(albumValidationSchema),
    });

    useEffect(() => {
        if (albumId > 0) {
            albumApi.getById(albumId).then((album) => {
                setValue('name', album.title);
                setValue('artist', album.artist);
            });
        }
    }, [albumId, setValue]);

    const onSubmit = (data) => {
        const action = albumId > 0 ? albumApi.update : albumApi.insert;
        const requestData = albumId > 0 ? { ...data, id: albumId } : data;
        action(requestData).then(() => navigate('/albums'));
    };
    

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>{albumId > 0 ? 'Edit Album' : 'Add New Album'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="albumFormTitle">
                        <div className="mb-3">
                            <label htmlFor="albumName" className="form-label">
                                <span className="visually-hidden">Required</span> Album Name:
                            </label>
                            <input
                                type="text"
                                id="albumName"
                                aria-describedby="albumNameHelp"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                {...register('name')}
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            {errors.name && (
                                <div className="invalid-feedback" id="albumNameHelp">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="albumArtist" className="form-label">
                                <span className="visually-hidden">Required</span> Artist:
                            </label>
                            <input
                                type="text"
                                id="albumArtist"
                                aria-describedby="albumArtistHelp"
                                className={`form-control ${errors.artist ? 'is-invalid' : ''}`}
                                {...register('artist')}
                                aria-invalid={errors.artist ? 'true' : 'false'}
                            />
                            {errors.artist && (
                                <div className="invalid-feedback" id="albumArtistHelp">
                                    {errors.artist.message}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success" aria-label="Save album">
                            SAVE
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate('/albums')}
                            aria-label="Cancel and go back to albums list"
                        >
                            CANCEL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlbumForm;
