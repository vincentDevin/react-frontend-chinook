import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        artistApi
            .getAll()
            .then((artists) => {
                setArtists(artists);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleShowModal = (artist) => {
        if (!artist.id) {
            console.error("Invalid artist ID:", artist);
            return;
        }
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
                .delete(selectedArtist.id)
                .then(() => {
                    setArtists((prevArtists) =>
                        prevArtists.filter((artist) => artist.id !== selectedArtist.id)
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
                Loading artists...
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
                <h2>Artists</h2>
                <Link to="/artists/add">
                    <button className="btn btn-primary" aria-label="Add a new artist">
                        Add Artist
                    </button>
                </Link>
            </div>
            <table
                className="table table-striped table-hover"
                role="table"
                aria-label="List of Artists"
            >
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Artist</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {artists.length > 0 ? (
                        artists.map((artist) => (
                            <tr key={artist.id}>
                                <td>{artist.name}</td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-secondary btn-sm w-25"
                                            onClick={() => navigate('/artists/' + artist.id)}
                                            aria-label={`Edit artist ${artist.name}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm w-25"
                                            onClick={() => handleShowModal(artist)}
                                            aria-label={`Delete artist ${artist.name}`}
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
                                No artists available.
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
                itemName={selectedArtist ? selectedArtist.name : ''}
            />
        </div>
    );
};

export default ArtistList;
