import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { artistApi } from '../../api/entitiesApi'; // Only need artistApi

const ArtistView = () => {
    const { artistId } = useParams(); // Get artistId from the route
    const navigate = useNavigate(); // To navigate to AlbumView
    const [artist, setArtist] = useState(null); // State to store artist details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch artist and album details when the component mounts
    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                setLoading(true);
                const artistData = await artistApi.getById(artistId); // Fetch artist by ID (including albums)
                setArtist(artistData); // Set the artist data, including albums
                setLoading(false);
            } catch {
                setError('Failed to load artist and albums');
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [artistId]);

    if (loading) {
        return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
    }

    if (error) {
        return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    }

    if (!artist) {
        return <div className="container mt-4"><div className="alert alert-warning">No artist found</div></div>;
    }

    return (
        <div className="container mt-4 artist-view">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">{artist.Name}</h1>
                </div>
                <div className="card-body">
                    <p><strong>Biography:</strong> {artist.Biography || 'No biography available'}</p>
                    
                    <h2 className="mt-4">Albums</h2>
                    {artist.albums && artist.albums.length > 0 ? (
                        <ul className="list-group">
                            {artist.albums.map((album) => (
                                <li key={album.AlbumId} className="list-group-item d-flex justify-content-between align-items-center">
                                    {album.Title}
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/albums/${album.AlbumId}`)} // Route to AlbumView
                                    >
                                        View
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No albums available for this artist</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistView;
