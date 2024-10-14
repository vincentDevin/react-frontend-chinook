// eslint-disable-next-line react/prop-types
const ConfirmDeleteModal = ({ show, handleClose, handleConfirm, itemName }) => {
    if (!show) return null;

    return (
        <div
            className="modal-overlay fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content modal-custom">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>
                            Are you sure you want to delete <strong>{itemName}</strong>? This action
                            cannot be undone.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
