import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { genreApi } from '../../api/entitiesApi';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const GenreList = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        genreApi
            .getAll()
            .then((genres) => {
                setGenres(genres);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleShowModal = (genre) => {
        if (!genre.id) {
            console.error("Invalid genre ID:", genre);
            return;
        }
        setSelectedGenre(genre);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGenre(null);
    };

    const handleConfirmDelete = () => {
        if (selectedGenre) {
            genreApi
                .delete(selectedGenre.id)
                .then(() => {
                    setGenres((prevGenres) =>
                        prevGenres.filter((genre) => genre.id !== selectedGenre.id)
                    );
                    handleCloseModal();
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    if (loading)
        return (
            <div className="container mt-4" role="status">
                Loading genres...
            </div>
        );
    if (error)
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 id="genreListHeading">Genres</h2>
                <Link to="/genres/add">
                    <button className="btn btn-primary" aria-label="Add a new genre">
                        Add Genre
                    </button>
                </Link>
            </div>
            <table className="table table-striped table-hover" aria-labelledby="genreListHeading">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Genre</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {genres.length > 0 ? (
                        genres.map((genre) => (
                            <tr key={genre.id}>
                                <td>{genre.name}</td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-secondary btn-sm w-25"
                                            onClick={() => navigate('/genres/' + genre.id)}
                                            aria-label={`Edit genre ${genre.name}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm w-25"
                                            onClick={() => handleShowModal(genre)}
                                            aria-label={`Delete genre ${genre.name}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center">
                                No genres available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
                itemName={selectedGenre ? selectedGenre.name : ''}
            />
        </div>
    );
};

export default GenreList;
