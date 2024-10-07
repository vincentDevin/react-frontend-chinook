import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import artistValidationSchema from '../../validation/artistValidationSchema';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import { getUserRoleFromToken } from '../../api/authUtils';

const ArtistForm = () => {
    const params = useParams();
    const artistId = params.artistId ? parseInt(params.artistId, 10) : 0;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiErrors, setApiErrors] = useState({}); // State for API errors
    const [isAdmin, setIsAdmin] = useState(false);

    // Validation schema
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(artistValidationSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                if (artistId > 0) {
                    const artist = await artistApi.getById(artistId);
                    // Ensure the field names match the form field
                    setValue('name', artist.Name);  // Set the field 'name' not 'Name'
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId, setValue]);
    
    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete artists.');
            return;
        }
    
        const requestData = {
            Name: data.name,  // Use 'name' from form and map it to 'Name' for the backend
            ...(artistId > 0 && { ArtistId: artistId }),  // Include ArtistId if editing
        };
    
        console.log('Submitting form data:', requestData); // Log data being submitted
    
        try {
            const action = artistId > 0 ? artistApi.update : artistApi.insert;
            await action(requestData);
            console.log('Form submitted successfully');
            navigate('/artists');
        } catch (err) {
            console.error('Error submitting form:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                setApiErrors(err.response.data.errors); // Handle API validation errors
            } else {
                setError(err.message);
            }
        }
    };
    
    
    // Clear API errors when form changes
    useEffect(() => {
        setApiErrors({});
    }, [register]);

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
                    <h3>{artistId > 0 ? 'Edit Artist' : 'Add New Artist'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="name"
                            label="Artist Name"
                            register={register}
                            error={errors.name || apiErrors.name}  // Ensure lowercase 'name' is used
                        />

                        <FormButtons onCancel={() => navigate('/artists')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistForm;
