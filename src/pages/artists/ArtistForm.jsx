import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import artistValidationSchema from '../../validation/artistValidationSchema';

const ArtistForm = () => {
    const params = useParams();
    const artistId = params.artistId || 0;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(artistValidationSchema),
    });

    useEffect(() => {
        if (artistId > 0) {
            artistApi.getById(artistId).then((artist) => setValue('name', artist.name));
        }
    }, [artistId, setValue]);

    const onSubmit = (data) => {
        const action = artistId > 0 ? artistApi.update : artistApi.insert;
        const requestData = artistId > 0 ? { ...data, id: artistId } : data;
        action(requestData).then(() => navigate('/artists'));
    };
    
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3 id="artistFormTitle">{artistId > 0 ? 'Edit Artist' : 'Add New Artist'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="artistFormTitle">
                        <div className="mb-3">
                            <label htmlFor="artistName" className="form-label">
                                Artist Name:
                            </label>
                            <input
                                type="text"
                                id="artistName"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                {...register('name')}
                                aria-invalid={errors.name ? 'true' : 'false'}
                                aria-describedby={errors.name ? 'artistNameError' : undefined}
                            />
                            {errors.name && (
                                <div id="artistNameError" className="invalid-feedback">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success">
                            SAVE
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate('/artists')}
                            aria-label="Cancel and go back to artist list"
                        >
                            CANCEL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistForm;
