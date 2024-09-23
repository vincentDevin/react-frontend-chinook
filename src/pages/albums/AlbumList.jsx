import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        albumApi
            .getAll()
            .then((albums) => {
                setAlbums(albums);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleShowModal = (album) => {
        if (!album.id) {
            console.error("Invalid album ID:", album);
            return;
        }
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
                .delete(selectedAlbum.id)
                .then(() => {
                    setAlbums((prevAlbums) =>
                        prevAlbums.filter((album) => album.id !== selectedAlbum.id)
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
                Loading albums...
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
                <h2 id="albumListTitle">Albums</h2>
                <Link to="/albums/add">
                    <button className="btn btn-primary" aria-label="Add new album">
                        Add Album
                    </button>
                </Link>
            </div>
            <table className="table table-striped table-hover" aria-labelledby="albumListTitle">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Album</th>
                        <th scope="col">Artist</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {albums.length > 0 ? (
                        albums.map((album) => (
                            <tr key={album.id}>
                                <td>{album.title}</td>
                                <td>{album.artist || 'Unknown Artist'}</td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-secondary btn-md"
                                            onClick={() => navigate('/albums/' + album.id)}
                                            aria-label={`Edit ${album.title} album`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-md"
                                            onClick={() => handleShowModal(album)}
                                            aria-label={`Delete ${album.title} album`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No albums available.
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
                itemName={selectedAlbum ? selectedAlbum.title : ''}
            />
        </div>
    );
};

export default AlbumList;
