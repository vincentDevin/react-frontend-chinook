import * as Yup from 'yup';

const albumValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Album Title is required')
        .min(2, 'Album Title must be at least 2 characters')
        .max(100, 'Album Title must be at most 100 characters'),
    artistId: Yup.number()
        .required('Artist is required')
        .typeError('Artist must be selected'),  // Ensures a number is selected from the dropdown
});

export default albumValidationSchema;
