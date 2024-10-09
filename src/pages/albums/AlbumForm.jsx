import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { albumApi, artistApi } from '../../api/entitiesApi';
import albumValidationSchema from '../../validation/albumValidationSchema';
import InputField from '../../components/InputField';
import FormButtons from '../../components/FormButtons';
import SelectField from '../../components/SelectField';
import { getUserRoleFromToken } from '../../api/authUtils';

const AlbumForm = () => {
    const params = useParams();
    const albumId = params.albumId ? parseInt(params.albumId, 10) : 0;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [artists, setArtists] = useState([]);  // State for artist options
    const [apiErrors, setApiErrors] = useState({}); 
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Handle form submission state

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(albumValidationSchema),
    });

    // Fetch artist options and album data (if editing)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRoleId = getUserRoleFromToken();
                if (userRoleId === 3) {
                    setIsAdmin(true);
                }

                // Fetch artist options
                const artistResponse = await artistApi.getAll();
                setArtists(artistResponse.artists || []);

                if (albumId > 0) {
                    // Fetch album data for editing
                    const album = await albumApi.getById(albumId);
                    setValue('title', album.Title);
                    setValue('artistId', album.ArtistId);  // Set ArtistId for editing
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [albumId, setValue]);

    // Handle form submission
    const onSubmit = async (data) => {
        if (!isAdmin) {
            setError('Only admins can create or edit albums.');
            return;
        }

        setIsSubmitting(true); // Set the form as submitting

        const requestData = {
            Title: data.title,  // Map form field 'title' to backend 'Title'
            ArtistId: data.artistId,  // Ensure ArtistId is passed
            ...(albumId > 0 && { AlbumId: albumId }),  // Include AlbumId if editing
        };

        try {
            const action = albumId > 0 ? albumApi.update : albumApi.insert;  // Decide if creating or updating
            await action(requestData);
            navigate('/albums');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setApiErrors(err.response.data.errors); // Handle API validation errors
            } else {
                setError(err.message);
            }
        } finally {
            setIsSubmitting(false); // Reset submission state
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
                    <h3>{albumId > 0 ? 'Edit Album' : 'Add New Album'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                        <InputField
                            id="title"
                            label="Album Title"
                            register={register}
                            error={errors.title || apiErrors.title}
                        />

                        {/* Add SelectField for artist selection */}
                        <SelectField
                            id="artistId"
                            label="Artist"
                            options={artists.map(artist => ({ value: artist.ArtistId, label: artist.Name }))}
                            register={register}
                            error={errors.artistId || apiErrors.artistId}
                        />

                        <FormButtons onCancel={() => navigate('/albums')} isSubmitting={isSubmitting} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlbumForm;
