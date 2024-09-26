import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import artistValidationSchema from '../../validation/artistValidationSchema';
import InputField from '../../components/InputField'; // Reusable input component
import FormButtons from '../../components/FormButtons'; // Reusable form buttons component

const ArtistForm = () => {
    const params = useParams();
    const artistId = params.artistId ? parseInt(params.artistId, 10) : 0; // Ensure artistId is a number
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(artistValidationSchema),
    });

    useEffect(() => {
        if (artistId > 0) {
            artistApi.getById(artistId).then((artist) => setValue('name', artist.name));
        }
    }, [artistId, setValue]);

    const onSubmit = (data) => {
        const action = artistId > 0 ? artistApi.update : artistApi.insert;
        const requestData = artistId > 0 ? { ...data, id: artistId } : data;
        action(requestData).then(() => navigate('/artists'));
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h3 id="artistFormTitle">{artistId > 0 ? 'Edit Artist' : 'Add New Artist'}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="artistFormTitle">
                        {/* InputField Component for Artist Name */}
                        <InputField
                            id="artistName"
                            label="Artist Name"
                            register={register}
                            error={errors.name}
                        />

                        {/* FormButtons Component for Save and Cancel */}
                        <FormButtons onCancel={() => navigate('/artists')} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistForm;
