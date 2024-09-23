import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trackApi } from '../../api/entitiesApi';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

// Duration formatter function
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const TrackList = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        trackApi
            .getAll()
            .then((tracks) => {
                setTracks(tracks);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleShowModal = (track) => {
        if (!track.id) {
            console.error("Invalid track ID:", track);
            return;
        }
        console.log(track);
        setSelectedTrack(track);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrack(null);
    };

    const handleConfirmDelete = () => {
        if (selectedTrack) {
            trackApi
                .delete(selectedTrack.id)
                .then(() => {
                    setTracks((prevTracks) =>
                        prevTracks.filter((track) => track.id !== selectedTrack.id)
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
                Loading tracks...
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
                <h2>Tracks</h2>
                <Link to="/tracks/add" aria-label="Add new track">
                    <button className="btn btn-primary">Add Track</button>
                </Link>
            </div>

            {/* Table for larger screens */}
            <div className="d-none d-lg-block table-responsive">
                <table className="table table-striped table-hover" aria-label="Track list">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Track</th>
                            <th scope="col">Album</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Media Type</th>
                            <th scope="col">Duration (mm:ss)</th>
                            <th scope="col">Price ($)</th>
                            <th scope="col" className="text-end">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks.map((track) => (
                            <tr key={track.id}>
                                <td>{track.name}</td>
                                <td>{track.album}</td>
                                <td>{track.genre}</td>
                                <td>{track.mediaType}</td>
                                <td>{formatDuration(track.milliseconds)}</td>
                                <td>{track.price.toFixed(2)}</td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-secondary btn-sm w-50"
                                            onClick={() => navigate('/tracks/' + track.id)}
                                            aria-label={`Edit ${track.name}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm w-50"
                                            onClick={() => handleShowModal(track)}
                                            aria-label={`Delete ${track.name}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card view for mobile screens */}
            <div className="d-lg-none">
                {tracks.map((track) => (
                    <div key={track.id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{track.name}</h5>
                            <p className="card-text">
                                <strong>Album:</strong> {track.album}
                                <br />
                                <strong>Genre:</strong> {track.genre}
                                <br />
                                <strong>Media Type:</strong> {track.mediaType}
                                <br />
                                <strong>Duration:</strong> {formatDuration(track.milliseconds)}
                                <br />
                                <strong>Price:</strong> ${track.price.toFixed(2)}
                            </p>
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-secondary btn-sm w-50"
                                    onClick={() => navigate('/tracks/' + track.id)}
                                    aria-label={`Edit ${track.name}`}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm w-50"
                                    onClick={() => handleShowModal(track)}
                                    aria-label={`Delete ${track.name}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
                itemName={selectedTrack ? selectedTrack.name : ''}
            />
        </div>
    );
};

export default TrackList;
