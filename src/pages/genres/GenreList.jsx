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
    const [isAdmin, setIsAdmin] = useState(false); 
    const [genres, setGenres] = useState([]); 
    const [selectedGenre, setSelectedGenre] = useState(null); 
    const [showModal, setShowModal] = useState(false); 

    useEffect(() => {
        const userRoleId = getUserRoleFromToken(); 
        if (userRoleId === 3) {
            setIsAdmin(true); 
        }
    }, []);

    const {
        items: paginatedGenres = [], 
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(genreApi.getAll, 10, 'genres');

    useEffect(() => {
        setGenres(paginatedGenres);
    }, [paginatedGenres]);

    const handleShowModal = (genre) => {
        setSelectedGenre(genre);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGenre(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedGenre) {
            try {
                await genreApi.delete(selectedGenre.GenreId); 
                setGenres((prevGenres) =>
                    prevGenres.filter((genre) => genre.GenreId !== selectedGenre.GenreId)
                );
                handleCloseModal();
            } catch (err) {
                console.error('Error deleting genre:', err.message);
            }
        }
    };

    const renderRow = (genre) => (
        <tr key={genre.GenreId} className="genre-row">
            <td>{genre.Name}</td>
            <td className="text-end">
                <div className="actions-container">
                    <button
                        className="btn-view"
                        onClick={() => navigate(`/genres/${genre.GenreId}/tracks`)}
                        aria-label={`View tracks for genre ${genre.Name}`}
                    >
                        View Tracks
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className="btn-edit"
                                onClick={() => navigate(`/genres/${genre.GenreId}`)}
                                aria-label={`Edit genre ${genre.Name}`}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-delete"
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

            <GenericTable
                headers={['Genre', 'Actions']}
                rows={genres.length > 0 ? genres : []}
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

export default GenreList;
