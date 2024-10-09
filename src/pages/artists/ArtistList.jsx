import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination'; // Import usePagination hook
import { getUserRoleFromToken } from '../../api/authUtils'; // Import the utility function to check admin

const ArtistList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

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
                        className="btn btn-primary btn-md"
                        onClick={() => navigate('/artists/' + artist.ArtistId)}
                        aria-label={`View ${artist.Name}`}
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-secondary btn-md"
                                onClick={() => navigate('/artists/' + artist.ArtistId + '/edit')}
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
                        </>
                    )}
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
            {isAdmin && (
                <GenericActions
                    title="Artists" // Pass the title prop
                    onAdd={() => navigate('/artists/add')}
                    selectedItem={selectedArtist}
                    onConfirmDelete={handleConfirmDelete}
                    onCancelDelete={handleCloseModal}
                    showModal={showModal}
                    addLink="/artists/add"
                />            
            )}

            {/* Generic Table Component */}
            <GenericTable
                headers={['Artist', ...(isAdmin ? ['Actions'] : ['View'])]} // Add 'View' header for non-admins
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
