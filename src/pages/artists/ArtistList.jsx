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
    const [artists, setArtists] = useState([]); // Local state for artist list
    const [selectedArtist, setSelectedArtist] = useState(null); // State for selected artist
    const [showModal, setShowModal] = useState(false); // State for controlling the delete modal

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

    // Use the custom pagination hook with the artist API function
    const {
        items: paginatedArtists = [], // Default to empty array if no data
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(artistApi.getAll, 10, 'artists'); // Pass the API function, items per page, and data key

    // Update artists state when paginatedArtists changes
    useEffect(() => {
        setArtists(paginatedArtists);
    }, [paginatedArtists]);

    // Handle showing the delete modal
    const handleShowModal = (artist) => {
        setSelectedArtist(artist);
        setShowModal(true);
    };

    // Handle closing the delete modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArtist(null); // Reset the selected artist
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (selectedArtist) {
            try {
                await artistApi.delete(selectedArtist.ArtistId); // Delete the artist
                
                // Update the artist list by removing the deleted artist
                setArtists((prevArtists) =>
                    prevArtists.filter((artist) => artist.ArtistId !== selectedArtist.ArtistId)
                );
                
                handleCloseModal(); // Close the modal
            } catch (err) {
                console.error('Error deleting artist:', err.message);
            }
        }
    };

    // Render row for each artist
    const renderRow = (artist) => (
        <tr key={artist.ArtistId}>
            <td>{artist.Name}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-primary btn-md"
                        onClick={() => navigate(`/artists/${artist.ArtistId}`)}
                        aria-label={`View ${artist.Name}`}
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-secondary btn-md"
                                onClick={() => navigate(`/artists/${artist.ArtistId}/edit`)}
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
        return <div className="container mt-4" role="status">Loading artists...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger" role="alert">Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            {isAdmin && (
                <GenericActions
                    title="Artists"
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
                headers={['Artist', 'Actions']}
                rows={artists.length > 0 ? artists : []}
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

export default ArtistList;
