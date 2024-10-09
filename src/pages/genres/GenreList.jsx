import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { genreApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import { getUserRoleFromToken } from '../../api/authUtils';

const GenreList = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
    const [genres, setGenres] = useState([]); // Local state for genre list
    const [selectedGenre, setSelectedGenre] = useState(null); // State for selected genre
    const [showModal, setShowModal] = useState(false); // State for controlling the delete modal

    // Check if the user is an admin
    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); // Get the role ID from the JWT token
        if (userRoleId === 3) {
            setIsAdmin(true); // If role ID is 3, the user is an admin
        }
    }, []);

    // Use the custom pagination hook with the genre API function
    const {
        items: paginatedGenres = [], // Use genres from the hook, default to an empty array
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(genreApi.getAll, 10, '', ''); // No dataKey or countKey since the response is a simple array

    // Update genres state when paginatedGenres changes
    useEffect(() => {
        setGenres(paginatedGenres);
    }, [paginatedGenres]);

    // Handle showing the delete modal
    const handleShowModal = (genre) => {
        setSelectedGenre(genre);
        setShowModal(true);
    };

    // Handle closing the delete modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGenre(null); // Reset the selected genre
    };

    // Confirm deletion and update the list without refreshing the page
    const handleConfirmDelete = async () => {
        if (selectedGenre) {
            try {
                await genreApi.delete(selectedGenre.GenreId); // Use GenreId as key
                
                // Update the genres list by removing the deleted genre
                setGenres((prevGenres) =>
                    prevGenres.filter((genre) => genre.GenreId !== selectedGenre.GenreId)
                );

                handleCloseModal(); // Close the modal after successful delete
            } catch (err) {
                console.error('Error deleting genre:', err.message);
            }
        }
    };

    const renderRow = (genre) => (
        <tr key={genre.GenreId}>
            <td>{genre.Name}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-primary btn-md"
                        onClick={() => navigate(`/genres/${genre.GenreId}/tracks`)}
                        aria-label={`View tracks for genre ${genre.Name}`}
                    >
                        View Tracks
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-secondary btn-md"
                                onClick={() => navigate('/genres/' + genre.GenreId)}
                                aria-label={`Edit genre ${genre.Name}`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-md"
                                onClick={() => handleShowModal(genre)}
                                aria-label={`Delete genre ${genre.Name}`}
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
                Loading genres...
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
                    title="Genres"
                    onAdd={() => navigate('/genres/add')}
                    selectedItem={selectedGenre}
                    onConfirmDelete={handleConfirmDelete}
                    onCancelDelete={handleCloseModal}
                    showModal={showModal}
                    addLink="/genres/add"
                />
            )}

            {/* Generic Table Component */}
            <GenericTable
                headers={['Genre', 'Actions']}
                rows={genres.length > 0 ? genres : []}
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

export default GenreList;
