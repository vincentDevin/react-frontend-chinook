import { useEffect, useState } from 'react';
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

    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors
    const [apiErrors, setApiErrors] = useState({}); // State to handle API validation errors

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(genreValidationSchema),
    });

    // Fetch genre data if editing
    useEffect(() => {
        if (genreId > 0) {
            genreApi.getById(genreId)
                .then((genre) => {
                    // Ensure we set the value of the field correctly from the response
                    setValue('name', genre.Name); // Match the key in the API response (use `Name` if that's what your API returns)
                })
                .catch(() => {
                    setError('Error loading genre'); // Handle error
                })
                .finally(() => setLoading(false)); // Stop loading
        } else {
            setLoading(false); // No need to load data when creating a new genre
        }
    }, [genreId, setValue]);

    const onSubmit = async (data) => {
        const action = genreId > 0 ? genreApi.update : genreApi.insert;
        const requestData = genreId > 0 ? { ...data, GenreId: genreId } : data; // Ensure the correct ID field is used

        try {
            await action(requestData);
            navigate('/genres'); // Navigate back to the genres list on success
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setApiErrors(err.response.data.errors); // Set API validation errors
            } else {
                setError('Error submitting the form'); // Handle general errors
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
                    <h3>{genreId > 0 ? 'Edit Genre' : 'Add New Genre'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        {/* InputField Component for Genre Name */}
                        <InputField
                            id="name" // Ensure the ID matches the schema field
                            label="Genre Name"
                            register={register}
                            error={errors.name || apiErrors.name} // Include both client-side and API validation errors
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
