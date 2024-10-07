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
    title, // New prop to accept the title for the section
}) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{title}</h2> {/* Use the title prop here */}
                <Link to={addLink} aria-label={`Add new ${title}`}>
                    <button className="btn btn-primary" onClick={onAdd}>
                        Add {title.slice(0, -1)} {/* Singular form */}
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
