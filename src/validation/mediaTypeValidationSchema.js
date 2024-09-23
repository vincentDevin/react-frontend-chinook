import * as Yup from 'yup';

const mediaTypeValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Media Type Name is required')
        .min(2, 'Media Type Name must be at least 2 characters')
        .max(100, 'Media Type Name must be at most 100 characters'),
});

export default mediaTypeValidationSchema;
