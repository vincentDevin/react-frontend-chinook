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
    const [isAdmin, setIsAdmin] = useState(false);

    // Validation schema for the track form
    const trackValidationSchema = Yup.object().shape({
        Name: Yup.string().required('Track name is required'),
        Milliseconds: Yup.number().min(1, 'Duration must be positive').required('Duration is required'),
        UnitPrice: Yup.number().min(0.01, 'Price must be at least 0.01').required('Price is required'),
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

    const onSubmit = (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete tracks.');
            return;
        }
   
        const action = trackId > 0 ? trackApi.update : trackApi.insert;
        const requestData = { ...data, TrackId: trackId }; // Ensure trackId is included
   
        action(requestData)
            .then(() => navigate('/tracks'))
            .catch((err) => setError(err.message));
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
                    <h3>{trackId > 0 ? 'Edit Track' : 'Add New Track'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="Name"
                            label="Track Name"
                            register={register}
                            error={errors.Name}
                        />
                        <InputField
                            id="Milliseconds"
                            label="Duration (ms)"
                            type="number"
                            register={register}
                            error={errors.Milliseconds}
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
                            error={errors.UnitPrice}
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
