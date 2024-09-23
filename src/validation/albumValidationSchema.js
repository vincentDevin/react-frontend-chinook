import * as Yup from 'yup';

const albumValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Album Name is required')
        .min(2, 'Album Name must be at least 2 characters')
        .max(100, 'Album Name must be at most 100 characters'),
    artist: Yup.string()
        .required('Artist is required')
        .min(2, 'Artist Name must be at least 2 characters')
        .max(100, 'Artist Name must be at most 100 characters'),
});

export default albumValidationSchema;
