import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import GenericActions from '../../components/GenericActions'; // Import GenericActions
import { getUserRoleFromToken } from '../../api/authUtils'; // Import the utility function

const AlbumList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
    const [albums, setAlbums] = useState([]); // Local state for album list
    const [selectedAlbum, setSelectedAlbum] = useState(null); // State for selected album
    const [showModal, setShowModal] = useState(false); // State for controlling the delete modal

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

    // Use the custom pagination hook with the album API function
    const {
        items: paginatedAlbums = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(albumApi.getAll, 10, 'albums'); // Pass 'albums' as the dataKey for correct extraction

    // Update albums state when paginatedAlbums changes
    useEffect(() => {
        setAlbums(paginatedAlbums);
    }, [paginatedAlbums]);

    // Handle showing the delete modal
    const handleShowModal = (album) => {
        setSelectedAlbum(album);
        setShowModal(true);
    };

    // Handle closing the delete modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAlbum(null); // Reset the selected album
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (selectedAlbum) {
            try {
                await albumApi.delete(selectedAlbum.AlbumId); // Delete the album
                
                // Update the album list by removing the deleted album
                setAlbums((prevAlbums) =>
                    prevAlbums.filter((album) => album.AlbumId !== selectedAlbum.AlbumId)
                );
                
                handleCloseModal(); // Close the modal
            } catch (err) {
                console.error('Error deleting album:', err.message);
            }
        }
    };

    // Render row for each album
    const renderRow = (album) => (
        <tr key={album.AlbumId}>
            <td>{album.Title}</td>
            <td>{album.ArtistName || 'Unknown Artist'}</td> {/* Use ArtistName from the backend response */}
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-primary btn-md"
                        onClick={() => navigate(`/albums/${album.AlbumId}`)}
                        aria-label={`View ${album.Title} album`}
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-secondary btn-md"
                                onClick={() => navigate(`/albums/${album.AlbumId}/edit`)}
                                aria-label={`Edit ${album.Title} album`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-md"
                                onClick={() => handleShowModal(album)}
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
                <GenericActions
                    title="Albums"
                    onAdd={() => navigate('/albums/add')}
                    selectedItem={selectedAlbum}
                    onConfirmDelete={handleConfirmDelete}
                    onCancelDelete={handleCloseModal}
                    showModal={showModal}
                    addLink="/albums/add"
                />
            )}

            {/* Generic Table Component */}
            <GenericTable
                headers={['Album', 'Artist', 'Actions']}
                rows={albums.length > 0 ? albums : []}
                renderRow={renderRow}
            />

            {/* Generic Pagination Component */}
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange} // Handle page changes
            />
        </div>
    );
};

export default AlbumList;
