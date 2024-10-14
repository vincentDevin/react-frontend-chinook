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
    const [isAdmin, setIsAdmin] = useState(false); 
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); 
        if (userRoleId === 3) {
            setIsAdmin(true); 
        }
    }, []);

    const {
        items: paginatedArtists = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(artistApi.getAll, 10, 'artists');

    useEffect(() => {
        setArtists(paginatedArtists);
    }, [paginatedArtists]);

    const handleShowModal = (artist) => {
        setSelectedArtist(artist);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArtist(null); 
    };

    const handleConfirmDelete = async () => {
        if (selectedArtist) {
            try {
                await artistApi.delete(selectedArtist.ArtistId);
                setArtists((prevArtists) =>
                    prevArtists.filter((artist) => artist.ArtistId !== selectedArtist.ArtistId)
                );
                handleCloseModal();
            } catch (err) {
                console.error('Error deleting artist:', err.message);
            }
        }
    };

    const renderRow = (artist) => (
        <tr key={artist.ArtistId} className="artist-row">
            <td>{artist.Name}</td>
            <td className="text-end">
                <div className="actions-container">
                    <button
                        className="btn-view"
                        onClick={() => navigate(`/artists/${artist.ArtistId}`)}
                        aria-label={`View ${artist.Name}`}
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn-edit"
                                onClick={() => navigate(`/artists/${artist.ArtistId}/edit`)}
                                aria-label={`Edit ${artist.Name}`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-delete"
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

            <GenericTable
                headers={['Artist', 'Actions']}
                rows={artists.length > 0 ? artists : []}
                renderRow={renderRow}
            />

            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ArtistList;
