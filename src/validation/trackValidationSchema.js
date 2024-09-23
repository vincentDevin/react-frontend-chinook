import * as Yup from 'yup';

const trackValidationSchema = Yup.object().shape({
    name: Yup.string().required('Track name is required'),
    album: Yup.string().required('Album is required'),
    genre: Yup.string().required('Genre is required'),
    mediaType: Yup.string().required('Media type is required'),
    milliseconds: Yup.number().min(1, 'Duration must be positive').required('Duration is required'),
    price: Yup.number().min(0.01, 'Price must be at least 0.01').required('Price is required'),
});

export default trackValidationSchema;
