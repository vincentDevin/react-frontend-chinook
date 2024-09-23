import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artistApi } from '../../api/entitiesApi'; // Import the artistApi from the consolidated API file

const ArtistList = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        artistApi.getAll().then((artists) => setArtists(artists));
    }, []);

    const navigate = useNavigate();

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
                    {artists.map((art) => (
                        <tr key={art.id}>
                            <td>{art.name}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => navigate('/artists/' + art.id)}
                                    aria-label={`Edit artist ${art.name}`}
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

export default ArtistList;
