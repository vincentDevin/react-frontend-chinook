/* eslint-disable react/prop-types */
const FormButtons = ({ onCancel }) => (
    <div className="mt-3">
        <button type="submit" className="btn btn-success">
            SAVE
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
            CANCEL
        </button>
    </div>
);

export default FormButtons;
