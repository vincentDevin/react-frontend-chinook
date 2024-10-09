import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import * as Yup from 'yup'; // Import Yup for validation
import InputField from '../../components/InputField'; // Reusable input component
import FormButtons from '../../components/FormButtons'; // Reusable form buttons component
import { getUserRoleFromToken } from '../../api/authUtils'; // Import auth utility to check for admin

const MediaTypeForm = () => {
    const params = useParams();
    const mediaTypeId = params.mediaTypeId ? parseInt(params.mediaTypeId, 10) : 0;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiErrors, setApiErrors] = useState({}); // State for storing API response errors
    const [isAdmin, setIsAdmin] = useState(false);

    // Validation schema for the media type form
    const mediaTypeValidationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Media Type name is required')
            .min(2, 'Media Type name must be at least 2 characters')
            .max(100, 'Media Type name must be at most 100 characters'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(mediaTypeValidationSchema),
    });

    // Fetch data for editing if mediaTypeId is greater than 0
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                if (mediaTypeId > 0) {
                    const mediaType = await mediaTypeApi.getById(mediaTypeId);
                    setValue('name', mediaType.Name); // Ensure field matches the API response
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mediaTypeId, setValue]);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete media types.');
            return;
        }
    
        // Explicitly setting the correct field name
        const requestData = {
            Name: data.name, // Capital 'N' to match server-side field name
            ...(mediaTypeId > 0 && { MediaTypeId: mediaTypeId }), // Include mediaTypeId if editing
        };
    
        try {
            const action = mediaTypeId > 0 ? mediaTypeApi.update : mediaTypeApi.insert;
            await action(requestData);
            navigate('/media-types'); // Redirect to media types list on success
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setApiErrors(err.response.data.errors);
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
                    <h3>{mediaTypeId > 0 ? 'Edit Media Type' : 'Add New Media Type'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="name"
                            label="Media Type Name"
                            register={register}
                            error={errors.name || apiErrors.name} // Include both client and server-side errors
                        />

                        {isAdmin && (
                            <FormButtons onCancel={() => navigate('/media-types')} />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MediaTypeForm;
