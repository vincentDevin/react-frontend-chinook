import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { albumApi, trackApi } from '../../api/entitiesApi';
import TrackCard from '../tracks/TrackCard';

const AlbumView = () => {
    const { albumId } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [expandedTrackId, setExpandedTrackId] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                setLoading(true);
                const albumData = await albumApi.getById(albumId);
                setAlbum(albumData);
                setLoading(false);
            } catch {
                setError('Failed to load album and tracks');
                setLoading(false);
            }
        };

        fetchAlbumData();
    }, [albumId]);

    const fetchTrackDetails = async (trackId) => {
        try {
            const trackData = await trackApi.getById(trackId);
            setSelectedTrack(trackData);
        } catch {
            setError('Failed to load track details');
        }
    };

    const handleTrackClick = (trackId) => {
        if (expandedTrackId === trackId) {
            setExpandedTrackId(null);
            setSelectedTrack(null);
        } else {
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
        <div className="container mt-4 album-view">
            <div className="card album-card">
                <div className="card-header">
                    <h1 className="card-title">{album.Title}</h1>
                    <p><strong>Artist:</strong> {album.ArtistName || 'Unknown Artist'}</p>
                </div>
                <div className="card-body">
                    <h2 className="mt-4">Tracks</h2>
                    {album.tracks && album.tracks.length > 0 ? (
                        <ul className="list-group track-list">
                            {album.tracks.map((track) => (
                                <li key={track.TrackId} className={`list-group-item track-item ${expandedTrackId === track.TrackId ? 'expanded' : ''}`}>
                                    <div
                                        className="d-flex justify-content-between align-items-center track-summary"
                                        onClick={() => handleTrackClick(track.TrackId)}
                                    >
                                        <div>
                                            {track.Name} - ${track.UnitPrice || 'Unknown Price'}
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            {expandedTrackId === track.TrackId ? 'Collapse' : 'View'}
                                        </button>
                                    </div>

                                    {expandedTrackId === track.TrackId && selectedTrack && (
                                        <div className="mt-3 track-details">
                                            <TrackCard
                                                track={selectedTrack}
                                                onEditClick={() => console.log('Edit clicked')}
                                                onDeleteClick={() => console.log('Delete clicked')}
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
