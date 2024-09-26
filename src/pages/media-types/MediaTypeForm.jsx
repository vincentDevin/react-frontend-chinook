import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import mediaTypeValidationSchema from '../../validation/mediaTypeValidationSchema';
import InputField from '../../components/InputField'; // Reusable input component
import FormButtons from '../../components/FormButtons'; // Reusable form buttons component

const MediaTypeForm = () => {
    const params = useParams();
    const mediaTypeId = params.mediaTypeId ? parseInt(params.mediaTypeId, 10) : 0; // Ensure mediaTypeId is a number
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
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        {/* InputField Component for Media Type Name */}
                        <InputField
                            id="mediaTypeName"
                            label="Media Type Name"
                            register={register}
                            error={errors.name}
                        />
                        
                        {/* FormButtons Component for Save and Cancel */}
                        <FormButtons onCancel={() => navigate('/media-types')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MediaTypeForm;
