import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { getUserRoleFromToken } from '../../api/authUtils'; // Import the utility function

const AlbumList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

    // Use the custom pagination hook with the album API function
    const {
        items: albums = [], // Use albums from the hook, default to empty array
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(albumApi.getAll, 10, 'albums'); // Pass 'albums' as the dataKey for correct extraction

    const [albumToDelete, setAlbumToDelete] = useState(null); // State for the album to be deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for controlling the delete modal

    // Handle row selection for deletion
    const handleDeleteClick = (album) => {
        setAlbumToDelete(album);
        setShowDeleteModal(true);
    };

    // Handle confirm delete in modal
    const handleDeleteConfirmed = async () => {
        if (albumToDelete) {
            try {
                await albumApi.delete(albumToDelete.AlbumId); // Call the delete API function
                handlePageChange(currentPage); // Refresh the data
                setShowDeleteModal(false); // Close the modal after deleting
                setAlbumToDelete(null); // Reset the album to delete state
            } catch (err) {
                console.error('Error deleting album:', err.message);
            }
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setAlbumToDelete(null); // Reset the album to delete state when closing the modal
    };

    // Render row for each album
    const renderRow = (album) => (
        <tr key={album.AlbumId}>
            <td>{album.Title}</td>
            <td>{album.ArtistName || 'Unknown Artist'}</td> {/* Use ArtistName from the backend response */}
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-secondary btn-md"
                                onClick={() => navigate(`/albums/${album.AlbumId}`)}
                                aria-label={`Edit ${album.Title} album`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-md"
                                onClick={() => handleDeleteClick(album)}
                                aria-label={`Delete ${album.Title} album`}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return <div className="container mt-4" role="status">Loading albums...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger" role="alert">Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            {isAdmin && (
                <div className="mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/albums/new')}
                    >
                        Add Album
                    </button>
                </div>
            )}
            
            {/* Generic Table Component */}
            <GenericTable
                headers={['Album', 'Artist', ...(isAdmin ? ['Actions'] : [])]}
                rows={albums.length > 0 ? albums : []}
                renderRow={renderRow}
            />

            {/* Generic Pagination Component */}
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange} // Handle page changes
            />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={showDeleteModal} // Control modal visibility
                handleClose={handleCloseModal} // Handle closing the modal
                handleConfirm={handleDeleteConfirmed} // Handle confirm delete
                itemName={albumToDelete ? albumToDelete.Title : ''} // Show the album name in modal
            />
        </div>
    );
};

export default AlbumList;
