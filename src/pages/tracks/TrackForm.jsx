import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { trackApi } from '../../api/entitiesApi';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import { getUserRoleFromToken } from '../../api/authUtils';

const TrackForm = () => {
    const params = useParams();
    const trackId = params.trackId ? parseInt(params.trackId, 10) : 0;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiErrors, setApiErrors] = useState({}); // State for storing API response errors
    const [isAdmin, setIsAdmin] = useState(false);

    // Validation schema for the track form
    const trackValidationSchema = Yup.object().shape({
        Name: Yup.string()
            .required('Track name is required')
            .min(2, 'Track name must be at least 2 characters')
            .max(100, 'Track name must be at most 100 characters'),
        Milliseconds: Yup.number()
            .min(1, 'Duration must be positive')
            .max(600000, 'Duration cannot exceed 10 minutes')
            .required('Duration is required'),
        UnitPrice: Yup.number()
            .min(0.01, 'Price must be at least 0.01')
            .max(999.99, 'Price cannot exceed $999.99')
            .required('Price is required'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(trackValidationSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                if (trackId > 0) {
                    const track = await trackApi.getById(trackId);
                    setValue('Name', track.Name);
                    setValue('Milliseconds', track.Milliseconds);
                    setValue('UnitPrice', parseFloat(track.UnitPrice));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [trackId, setValue]);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete tracks.');
            return;
        }

        const action = trackId > 0 ? trackApi.update : trackApi.insert;
        const requestData = { ...data, TrackId: trackId }; // Ensure trackId is included

        try {
            await action(requestData);
            navigate('/tracks'); // Redirect to tracks list on success
        } catch (err) {
            // If API response contains validation errors, set them
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
                    <h3>{trackId > 0 ? 'Edit Track' : 'Add New Track'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="Name"
                            label="Track Name"
                            register={register}
                            error={errors.Name || apiErrors.Name} // Include both client and server-side errors
                        />
                        <InputField
                            id="Milliseconds"
                            label="Duration (ms)"
                            type="number"
                            register={register}
                            error={errors.Milliseconds || apiErrors.Milliseconds} // Include both client and server-side errors
                            aria-describedby="durationHelp"
                        />
                        <small id="durationHelp" className="form-text text-muted">
                            Enter the duration in milliseconds.
                        </small>
                        <InputField
                            id="UnitPrice"
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            register={register}
                            error={errors.UnitPrice || apiErrors.UnitPrice} // Include both client and server-side errors
                        />

                        {isAdmin && (
                            <FormButtons onCancel={() => navigate('/tracks')} />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrackForm;
