import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const MediaTypeList = () => {
    const [mediaTypes, setMediaTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedMediaType, setSelectedMediaType] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        mediaTypeApi
            .getAll()
            .then((mediaTypes) => {
                setMediaTypes(mediaTypes);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleShowModal = (mediaType) => {
        if (!mediaType.id) {
            console.error("Invalid media type ID:", mediaType);
            return;
        }
        setSelectedMediaType(mediaType);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMediaType(null);
    };

    const handleConfirmDelete = () => {
        if (selectedMediaType) {
            mediaTypeApi
                .delete(selectedMediaType.id)
                .then(() => {
                    setMediaTypes((prevMediaTypes) =>
                        prevMediaTypes.filter((mediaType) => mediaType.id !== selectedMediaType.id)
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
                Loading media types...
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
                <h2>Media Types</h2>
                <Link to="/media-types/add">
                    <button className="btn btn-primary" aria-label="Add a new media type">
                        Add Media Type
                    </button>
                </Link>
            </div>
            <table className="table table-striped table-hover" aria-labelledby="mediaTypesHeading">
                <caption id="mediaTypesHeading" className="sr-only">
                    List of media types
                </caption>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Media Type</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {mediaTypes.map((mediaType) => (
                        <tr key={mediaType.id}>
                            <td>{mediaType.name}</td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn btn-secondary btn-md"
                                        onClick={() => navigate('/media-types/' + mediaType.id)}
                                        aria-label={`Edit ${mediaType.name}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-md"
                                        onClick={() => handleShowModal(mediaType)}
                                        aria-label={`Delete ${mediaType.name}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
                itemName={selectedMediaType ? selectedMediaType.name : ''}
            />
        </div>
    );
};

export default MediaTypeList;
