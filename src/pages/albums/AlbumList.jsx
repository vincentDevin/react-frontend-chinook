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
    const [isAdmin, setIsAdmin] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken();
        if (userRoleId === 3) {
            setIsAdmin(true);
        }
    }, []);

    // Use the custom pagination hook
    const {
        items: paginatedAlbums = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(albumApi.getAll, 10, 'albums');

    useEffect(() => {
        setAlbums(paginatedAlbums);
    }, [paginatedAlbums]);

    const handleShowModal = (album) => {
        setSelectedAlbum(album);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAlbum(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedAlbum) {
            try {
                await albumApi.delete(selectedAlbum.AlbumId);
                setAlbums((prevAlbums) =>
                    prevAlbums.filter((album) => album.AlbumId !== selectedAlbum.AlbumId)
                );
                handleCloseModal();
            } catch (err) {
                console.error('Error deleting album:', err.message);
            }
        }
    };

    const renderRow = (album) => (
        <tr key={album.AlbumId} className="album-row">
            <td>{album.Title}</td>
            <td>{album.ArtistName || 'Unknown Artist'}</td>
            <td className="text-end">
                <div className="actions-container">
                    <button
                        className="btn-view"
                        onClick={() => navigate(`/albums/${album.AlbumId}`)}
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn-edit"
                                onClick={() => navigate(`/albums/${album.AlbumId}/edit`)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => handleShowModal(album)}
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
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default AlbumList;
