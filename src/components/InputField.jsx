import PropTypes from 'prop-types'; // Import PropTypes for validation

const InputField = ({ id, label, type, register, error, ...rest }) => (
    <div className="mb-3">
        <label htmlFor={id} className="form-label">
            {label}
        </label>
        <input
            type={type}
            id={id}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            {...register(id)}
            aria-invalid={error ? 'true' : 'false'}
            {...rest}
        />
        {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
);

// Define PropTypes for the InputField component
InputField.propTypes = {
    id: PropTypes.string.isRequired, // `id` is required and should be a string
    label: PropTypes.string.isRequired, // `label` is required and should be a string
    type: PropTypes.string, // `type` is a string with a default value set
    register: PropTypes.func.isRequired, // `register` is required and should be a function
    error: PropTypes.shape({
        message: PropTypes.string, // `error` should be an object with an optional `message` string
    }), // `error` is optional but should match the defined shape if present
};

// Default props for the component
InputField.defaultProps = {
    type: 'text', // Default type is 'text' if not provided
    error: null, // Default error is null
};

export default InputField;
