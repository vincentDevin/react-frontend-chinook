import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi'; // Adjust to the correct API
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import { getUserRoleFromToken } from '../../api/authUtils'; // Import the utility function

const ArtistForm = () => {
    const params = useParams();
    const artistId = params.artistId ? parseInt(params.artistId, 10) : 0;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // State to store if the user is an admin

    const artistValidationSchema = Yup.object().shape({
        Name: Yup.string().required('Artist name is required'),
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(artistValidationSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken(); // Get the user's role ID from the JWT token
                if (userRoleId === 3) {
                    setIsAdmin(true); // Set admin if roleId is 3
                }

                if (artistId > 0) {
                    const artist = await artistApi.getById(artistId);
                    setValue('Name', artist.Name);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId, setValue]);

    const onSubmit = (data) => {
        if (!isAdmin) {
            setError('Only admins can edit or delete artists.');
            return;
        }

        const action = artistId > 0 ? artistApi.update : artistApi.insert;
        const requestData = artistId > 0 ? { ...data, ArtistId: artistId } : data;

        action(requestData)
            .then(() => navigate('/artists'))
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
                    <h3>{artistId > 0 ? 'Edit Artist' : 'Add New Artist'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="Name"
                            label="Artist Name"
                            register={register}
                            error={errors.Name}
                        />
                        {isAdmin && (
                            <FormButtons onCancel={() => navigate('/artists')} />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistForm;
