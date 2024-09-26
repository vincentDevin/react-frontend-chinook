import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination'; // Import the usePagination hook

const AlbumList = () => {
    const navigate = useNavigate();

    // Use the custom pagination hook with the album API function
    const {
        items: albums = [], // Use albums from the hook, default to empty array
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(albumApi.getAll, 10, 'albums'); // Pass 'albums' as the dataKey for correct extraction

    const [showModal, setShowModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const handleShowModal = (album) => {
        setSelectedAlbum(album);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAlbum(null);
    };

    const handleConfirmDelete = () => {
        if (selectedAlbum) {
            albumApi
                .delete(selectedAlbum.AlbumId) // Use AlbumId as key
                .then(() => {
                    handlePageChange(currentPage); // Refresh data after deleting an album
                    handleCloseModal();
                })
                .catch((err) => {
                    console.error('Error deleting album:', err.message);
                });
        }
    };

    const renderRow = (album) => (
        <tr key={album.AlbumId}>
            <td>{album.Title}</td>
            <td>{album.ArtistName || 'Unknown Artist'}</td> {/* Use ArtistName from the backend response */}
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-md"
                        onClick={() => navigate('/albums/' + album.AlbumId)}
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
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading albums...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Generic Actions Component */}
            <GenericActions
                onAdd={() => navigate('/albums/add')}
                selectedItem={selectedAlbum}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCloseModal}
                showModal={showModal}
                addLink="/albums/add"
            />

            {/* Generic Table Component */}
            <GenericTable
                headers={['Album', 'Artist', 'Actions']}
                rows={albums} // Use albums from the usePagination hook
                renderRow={renderRow}
            />

            {/* Generic Pagination Component */}
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default AlbumList;
