import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { albumApi } from '../../api/entitiesApi'; // Import the albumApi from the consolidated API file

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        albumApi.getAll().then((albums) => setAlbums(albums));
    }, []);

    const navigate = useNavigate();

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
                    {albums.map((album) => (
                        <tr key={album.id}>
                            <td>{album.title}</td>
                            <td>{album.artist || 'Unknown Artist'}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => navigate('/albums/' + album.id)}
                                    aria-label={`Edit ${album.title} album`}
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

export default AlbumList;
