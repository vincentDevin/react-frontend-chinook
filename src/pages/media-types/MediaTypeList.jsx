import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import { getUserRoleFromToken } from '../../api/authUtils';

const MediaTypeList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [selectedMediaType, setSelectedMediaType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken();
        if (userRoleId === 3) {
            setIsAdmin(true);
        }
    }, []);

    // Use the custom pagination hook with the media type API function
    const {
        items: paginatedMediaTypes = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(mediaTypeApi.getAll, 10, 'mediaTypes');

    // Update mediaTypes state when paginatedMediaTypes changes
    useEffect(() => {
        setMediaTypes(paginatedMediaTypes);
    }, [paginatedMediaTypes]);

    // Handle showing the delete modal
    const handleShowModal = (mediaType) => {
        setSelectedMediaType(mediaType);
        setShowModal(true);
    };

    // Handle closing the delete modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMediaType(null);
    };

    // Confirm deletion and update the list without refreshing the page
    const handleConfirmDelete = async () => {
        if (selectedMediaType) {
            try {
                await mediaTypeApi.delete(selectedMediaType.MediaTypeId);

                setMediaTypes((prevMediaTypes) =>
                    prevMediaTypes.filter((mediaType) => mediaType.MediaTypeId !== selectedMediaType.MediaTypeId)
                );

                handleCloseModal();
            } catch (err) {
                console.error('Error deleting media type:', err.message);
            }
        }
    };

    // Render each table row
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
        return <div className="container mt-4" role="status">Loading media types...</div>;
    }

    // Render error state
    if (error) {
        return <div className="container mt-4 text-danger" role="alert">Error: {error}</div>;
    }

    // Render main content
    return (
        <div className="container mt-4 media-type-list">
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

            <GenericTable
                headers={['Media Type', ...(isAdmin ? ['Actions'] : [])]}
                rows={mediaTypes.length > 0 ? mediaTypes : []}
                renderRow={renderRow}
            />

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
