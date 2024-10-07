import PropTypes from 'prop-types';

const FormButtons = ({ onCancel, isSubmitting = false }) => (
    <div className="mt-3">
        <button
            type="submit"
            className="btn btn-success"
            aria-label="Save"
            disabled={isSubmitting} // Disable button if form is submitting
        >
            {isSubmitting ? 'Saving...' : 'SAVE'} {/* Change text during submission */}
        </button>
        <button
            type="button"
            className="btn btn-secondary ms-2"
            aria-label="Cancel"
            onClick={onCancel}
        >
            CANCEL
        </button>
    </div>
);

// PropTypes validation for better development experience
FormButtons.propTypes = {
    onCancel: PropTypes.func.isRequired, // Ensure onCancel is passed and is a function
    isSubmitting: PropTypes.bool, // Optional prop to handle form submission state
};

export default FormButtons;
