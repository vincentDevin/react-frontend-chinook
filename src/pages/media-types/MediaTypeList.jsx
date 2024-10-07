import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import { getUserRoleFromToken } from '../../api/authUtils'; // Import utility function to check admin status

const MediaTypeList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

    // Use the custom pagination hook with the media type API function
    const {
        items: mediaTypes = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(mediaTypeApi.getAll, 10, 'mediaTypes'); // Pass 'mediaTypes' as the dataKey
    
    const [showModal, setShowModal] = useState(false);
    const [selectedMediaType, setSelectedMediaType] = useState(null);

    // Show delete confirmation modal
    const handleShowModal = (mediaType) => {
        setSelectedMediaType(mediaType);
        setShowModal(true);
    };

    // Close delete confirmation modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMediaType(null);
    };

    // Confirm deletion and refresh data if successful
    const handleConfirmDelete = () => {
        if (selectedMediaType) {
            mediaTypeApi
                .delete(selectedMediaType.MediaTypeId) // Use MediaTypeId as key
                .then(() => {
                    // Check if the current page has items left, if not, move to the previous page
                    const newPage = currentPage > 1 && mediaTypes.length === 1 ? currentPage - 1 : currentPage;
                    handlePageChange(newPage); // Refresh data after deleting a media type
                    handleCloseModal(); // Close the modal after successful delete
                })
                .catch((err) => {
                    console.error('Error deleting media type:', err.message);
                });
        }
    };

    // Function to render each table row
    const renderRow = (mediaType) => (
        <tr key={mediaType.MediaTypeId}>
            <td>{mediaType.Name}</td>
            <td className="text-end">
                {isAdmin && (
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-secondary btn-md"
                            onClick={() => navigate('/media-types/' + mediaType.MediaTypeId)}
                            aria-label={`Edit ${mediaType.Name}`}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger btn-md"
                            onClick={() => handleShowModal(mediaType)}
                            aria-label={`Delete ${mediaType.Name}`}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );

    // Render loading state
    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading media types...
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    // Render the main table and pagination
    return (
        <div className="container mt-4">
            {isAdmin && (
                <GenericActions
                    title="Media Types"
                    onAdd={() => navigate('/media-types/add')}
                    selectedItem={selectedMediaType}
                    onConfirmDelete={handleConfirmDelete}
                    onCancelDelete={handleCloseModal}
                    showModal={showModal}
                    addLink="/media-types/add"
                />
            )}

            {/* Generic Table Component */}
            <GenericTable
                headers={['Media Type', ...(isAdmin ? ['Actions'] : [])]}
                rows={mediaTypes} // Use mediaTypes from the usePagination hook
                renderRow={renderRow}
            />

            {/* Generic Pagination Component */}
            {totalPages > 1 && (
                <GenericPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default MediaTypeList;
