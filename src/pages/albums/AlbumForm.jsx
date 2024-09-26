import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import albumValidationSchema from '../../validation/albumValidationSchema';
import InputField from '../../components/InputField'; // Reusable input component
import FormButtons from '../../components/FormButtons'; // Reusable form buttons component

const AlbumForm = () => {
    const params = useParams();
    const albumId = params.albumId ? parseInt(params.albumId, 10) : 0; // Ensure albumId is a number
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(albumValidationSchema),
    });

    useEffect(() => {
        if (albumId > 0) {
            albumApi.getById(albumId).then((album) => {
                setValue('name', album.title);
                setValue('artist', album.artist);
            });
        }
    }, [albumId, setValue]);

    const onSubmit = (data) => {
        const action = albumId > 0 ? albumApi.update : albumApi.insert;
        const requestData = albumId > 0 ? { ...data, id: albumId } : data;
        action(requestData).then(() => navigate('/albums'));
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3 id="albumFormTitle">{albumId > 0 ? 'Edit Album' : 'Add New Album'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="albumFormTitle">
                        {/* InputField Component for Album Name */}
                        <InputField
                            id="albumName"
                            label="Album Name"
                            register={register}
                            error={errors.name}
                        />

                        {/* InputField Component for Artist Name */}
                        <InputField
                            id="albumArtist"
                            label="Artist"
                            register={register}
                            error={errors.artist}
                        />

                        {/* FormButtons Component for Save and Cancel */}
                        <FormButtons onCancel={() => navigate('/albums')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlbumForm;
