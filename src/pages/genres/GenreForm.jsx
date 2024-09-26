import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { genreApi } from '../../api/entitiesApi';
import genreValidationSchema from '../../validation/genreValidationSchema';
import InputField from '../../components/InputField'; // Reusable input component
import FormButtons from '../../components/FormButtons'; // Reusable form buttons component

const GenreForm = () => {
    const params = useParams();
    const genreId = params.genreId ? parseInt(params.genreId, 10) : 0; // Ensure genreId is a number
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
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        {/* InputField Component for Genre Name */}
                        <InputField
                            id="genreName"
                            label="Genre Name"
                            register={register}
                            error={errors.name}
                        />
                        
                        {/* FormButtons Component for Save and Cancel */}
                        <FormButtons onCancel={() => navigate('/genres')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenreForm;
