import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mediaTypeApi } from '../../api/entitiesApi';

const MediaTypeList = () => {
    const [mediaTypes, setMediaTypes] = useState([]);

    useEffect(() => {
        mediaTypeApi.getAll().then((mediaTypes) => setMediaTypes(mediaTypes));
    }, []);

    const navigate = useNavigate();

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
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => navigate('/media-types/' + mediaType.id)}
                                    aria-label={`Edit ${mediaType.name}`}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MediaTypeList;
