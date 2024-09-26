/* eslint-disable react/prop-types */
// src/components/GenericActions.js

import { Link } from 'react-router-dom';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Assuming the modal is generic

const GenericActions = ({
    onAdd,
    selectedItem,
    onConfirmDelete,
    onCancelDelete,
    showModal,
    addLink,
}) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Items</h2>
                <Link to={addLink} aria-label="Add new item">
                    <button className="btn btn-primary" onClick={onAdd}>
                        Add Item
                    </button>
                </Link>
            </div>
            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={showModal}
                handleClose={onCancelDelete}
                handleConfirm={onConfirmDelete}
                itemName={selectedItem ? selectedItem.Name : ''}
            />
        </>
    );
};

export default GenericActions;
