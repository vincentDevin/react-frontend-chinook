import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { genreApi } from '../../api/entitiesApi';
import genreValidationSchema from '../../validation/genreValidationSchema';

const GenreForm = () => {
    const params = useParams();
    const genreId = params.genreId || 0;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(genreValidationSchema),
    });

    useEffect(() => {
        if (genreId > 0) {
            genreApi.getById(genreId).then((genre) => setValue('name', genre.name));
        }
    }, [genreId, setValue]);

    const onSubmit = (data) => {
        const action = genreId > 0 ? genreApi.update : genreApi.insert;
        const requestData = genreId > 0 ? { ...data, id: genreId } : data;
        action(requestData).then(() => navigate('/genres'));
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>{genreId > 0 ? 'Edit Genre' : 'Add New Genre'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="genreFormHeading">
                        <fieldset>
                            <legend id="genreFormHeading">
                                {genreId > 0 ? 'Edit Genre Form' : 'Add New Genre Form'}
                            </legend>
                            <div className="mb-3">
                                <label htmlFor="genreName" className="form-label">
                                    Genre Name:
                                </label>
                                <input
                                    type="text"
                                    id="genreName"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                    aria-describedby={errors.name ? 'genreNameError' : undefined}
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <div id="genreNameError" className="invalid-feedback">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    aria-label="Save genre"
                                >
                                    SAVE
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => navigate('/genres')}
                                    aria-label="Cancel and go back to genres list"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenreForm;
