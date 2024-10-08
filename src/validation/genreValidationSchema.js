import * as Yup from 'yup';

const genreValidationSchema = Yup.object().shape({
    Name: Yup.string()
        .required('Genre Name is required')
        .min(2, 'Genre Name must be at least 2 characters')
        .max(100, 'Genre Name must be at most 100 characters'),
});

export default genreValidationSchema;
