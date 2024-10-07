import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { albumApi, trackApi } from '../../api/entitiesApi'; // Import trackApi for fetching track details
import TrackCard from '../tracks/TrackCard'; // Import TrackCard for displaying track details

const AlbumView = () => {
    const { albumId } = useParams(); // Get albumId from the route
    const [album, setAlbum] = useState(null); // State to store album details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [selectedTrack, setSelectedTrack] = useState(null); // State for selected track's full details
    const [expandedTrackId, setExpandedTrackId] = useState(null); // State to track which track is expanded

    // Fetch album and track details when the component mounts
    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                setLoading(true);
                const albumData = await albumApi.getById(albumId); // Fetch album by ID (including tracks)
                setAlbum(albumData); // Set the album data, including tracks
                setLoading(false);
            } catch {
                setError('Failed to load album and tracks');
                setLoading(false);
            }
        };

        fetchAlbumData();
    }, [albumId]);

    // Fetch track details when a track is expanded
    const fetchTrackDetails = async (trackId) => {
        try {
            const trackData = await trackApi.getById(trackId); // Fetch track details by trackId
            setSelectedTrack(trackData); // Set the selected track's full details
        } catch {
            setError('Failed to load track details');
        }
    };

    const handleTrackClick = (trackId) => {
        if (expandedTrackId === trackId) {
            // Collapse the track if it's already expanded
            setExpandedTrackId(null);
            setSelectedTrack(null); // Clear selected track details
        } else {
            // Expand the track and fetch its full details
            setExpandedTrackId(trackId);
            fetchTrackDetails(trackId);
        }
    };

    if (loading) {
        return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
    }

    if (error) {
        return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    }

    if (!album) {
        return <div className="container mt-4"><div className="alert alert-warning">No album found</div></div>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">{album.Title}</h1>
                    <p><strong>Artist:</strong> {album.ArtistName || 'Unknown Artist'}</p> {/* Display artist name */}
                </div>
                <div className="card-body">
                    <h2 className="mt-4">Tracks</h2>
                    {album.tracks && album.tracks.length > 0 ? (
                        <ul className="list-group">
                            {album.tracks.map((track) => (
                                <li key={track.TrackId} className="list-group-item">
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        onClick={() => handleTrackClick(track.TrackId)} // Click handler to toggle view
                                    >
                                        <div>
                                            {track.Name} - ${track.UnitPrice || 'Unknown Price'} {/* Display track price */}
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            {expandedTrackId === track.TrackId ? 'Collapse' : 'View'}
                                        </button>
                                    </div>

                                    {/* Conditionally render TrackCard with full track details when expanded */}
                                    {expandedTrackId === track.TrackId && selectedTrack && (
                                        <div className="mt-3">
                                            <TrackCard
                                                track={selectedTrack} // Pass the detailed track data to TrackCard
                                                onEditClick={() => console.log('Edit clicked')} // Add your edit logic
                                                onDeleteClick={() => console.log('Delete clicked')} // Add your delete logic
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tracks available for this album</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumView;
