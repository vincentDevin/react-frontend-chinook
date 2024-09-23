import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import mediaTypeValidationSchema from '../../validation/mediaTypeValidationSchema';

const MediaTypeForm = () => {
    const params = useParams();
    const mediaTypeId = params.mediaTypeId || 0;
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(mediaTypeValidationSchema),
    });

    useEffect(() => {
        if (mediaTypeId > 0) {
            mediaTypeApi.getById(mediaTypeId).then((mediaType) => setValue('name', mediaType.name));
        }
    }, [mediaTypeId, setValue]);

    const onSubmit = (data) => {
        const action = mediaTypeId > 0 ? mediaTypeApi.update : mediaTypeApi.insert;
        const requestData = mediaTypeId > 0 ? { ...data, id: mediaTypeId } : data;
        action(requestData).then(() => navigate('/media-types'));
    };
    

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3>{mediaTypeId > 0 ? 'Edit Media Type' : 'Add New Media Type'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="mediaTypeFormHeading">
                        <div className="mb-3">
                            <label htmlFor="mediaTypeName" className="form-label">
                                Media Type Name:
                            </label>
                            <input
                                type="text"
                                id="mediaTypeName"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                {...register('name')}
                                aria-describedby="mediaTypeNameHelp"
                            />
                            {errors.name && (
                                <div id="mediaTypeNameHelp" className="invalid-feedback">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success"
                            aria-label="Save media type"
                        >
                            SAVE
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate('/media-types')}
                            aria-label="Cancel and go back to media types list"
                        >
                            CANCEL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MediaTypeForm;
