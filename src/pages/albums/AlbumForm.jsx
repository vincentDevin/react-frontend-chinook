import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import albumValidationSchema from '../../validation/albumValidationSchema';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import { getUserRoleFromToken } from '../../api/authUtils';

const AlbumForm = () => {
    const params = useParams();
    const albumId = params.albumId ? parseInt(params.albumId, 10) : 0;
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
        resolver: yupResolver(albumValidationSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                if (albumId > 0) {
                    const album = await albumApi.getById(albumId);
                    setValue('title', album.Title);  // Match field name in the form to 'title'
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [albumId, setValue]);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete albums.');
            return;
        }

        const requestData = {
            Title: data.title,  // Map 'title' from form to 'Title' for backend
            ...(albumId > 0 && { AlbumId: albumId }),  // Include AlbumId if editing
        };

        console.log('Submitting form data:', requestData); // Log data being submitted

        try {
            const action = albumId > 0 ? albumApi.update : albumApi.insert;
            await action(requestData);
            console.log('Form submitted successfully');
            navigate('/albums');
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
                    <h3>{albumId > 0 ? 'Edit Album' : 'Add New Album'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="title"
                            label="Album Title"
                            register={register}
                            error={errors.title || apiErrors.title}  // Ensure lowercase 'title' is used
                        />

                        <FormButtons onCancel={() => navigate('/albums')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlbumForm;
