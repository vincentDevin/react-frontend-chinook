import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination'; // Import usePagination hook

const ArtistList = () => {
    const navigate = useNavigate();

    // Use the custom pagination hook with the artist API function
    const {
        items: artists = [], // Default to empty array if no data
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(artistApi.getAll, 10, 'artists'); // Pass the API function, items per page, and data key

    const [showModal, setShowModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const handleShowModal = (artist) => {
        setSelectedArtist(artist);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArtist(null);
    };

    const handleConfirmDelete = () => {
        if (selectedArtist) {
            artistApi
                .delete(selectedArtist.ArtistId) // Use ArtistId instead of id
                .then(() => {
                    handlePageChange(currentPage); // Refresh data after deleting an artist
                    handleCloseModal();
                })
                .catch((err) => {
                    console.error('Error deleting artist:', err.message);
                });
        }
    };

    const renderRow = (artist) => (
        <tr key={artist.ArtistId}>
            <td>{artist.Name}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-md"
                        onClick={() => navigate('/artists/' + artist.ArtistId)}
                        aria-label={`Edit ${artist.Name}`}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-md"
                        onClick={() => handleShowModal(artist)}
                        aria-label={`Delete ${artist.Name}`}
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
                Loading artists...
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
                onAdd={() => navigate('/artists/add')}
                selectedItem={selectedArtist}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCloseModal}
                showModal={showModal}
                addLink="/artists/add"
            />

            {/* Generic Table Component */}
            <GenericTable
                headers={['Artist', 'Actions']}
                rows={artists} // Use artists from the usePagination hook
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

export default ArtistList;
