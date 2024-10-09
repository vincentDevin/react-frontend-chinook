import * as Yup from 'yup';

const artistValidationSchema = Yup.object().shape({
    name: Yup.string()  // Change to 'Name' if this is what your backend expects
        .required('Artist Name is required')
        .min(2, 'Artist Name must be at least 2 characters')
        .max(100, 'Artist Name must be at most 100 characters'),
});

export default artistValidationSchema;
