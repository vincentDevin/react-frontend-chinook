import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { trackApi } from '../../api/entitiesApi'; // Assuming you have a trackApi for fetching tracks
import TrackCard from './TrackCard'; // Import the TrackCard component

// Utility function to format duration from milliseconds to "mm:ss"
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const TrackView = () => {
    const { trackId } = useParams(); // Get trackId from the route
    const navigate = useNavigate(); // To navigate to the edit form if needed
    const [track, setTrack] = useState(null); // State to store track details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch track details when the component mounts
    useEffect(() => {
        const fetchTrackData = async () => {
            try {
                setLoading(true);
                const trackData = await trackApi.getById(trackId); // Fetch track by ID
                setTrack(trackData); // Set the track data
                setLoading(false);
            } catch {
                setError('Failed to load track');
                setLoading(false);
            }
        };

        fetchTrackData();
    }, [trackId]);

    if (loading) {
        return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
    }

    if (error) {
        return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    }

    if (!track) {
        return <div className="container mt-4"><div className="alert alert-warning">Track not found</div></div>;
    }

    // Convert UnitPrice to a number and set a fallback if it's not a valid number
    const formattedPrice = !isNaN(parseFloat(track.UnitPrice))
        ? `$${parseFloat(track.UnitPrice).toFixed(2)}`
        : 'Unknown Price';

    // Handlers for edit and delete actions
    const handleEditClick = () => {
        navigate(`/tracks/${track.TrackId}/edit`); // Navigate to the edit form
    };

    const handleDeleteClick = async () => {
        try {
            await trackApi.delete(track.TrackId); // Delete the track
            navigate('/tracks'); // Navigate back to the track list after deletion
        } catch (err) {
            console.error('Failed to delete track:', err.message);
        }
    };

    return (
        <div className="container mt-4 track-view">
            {/* Header Section */}
            <div className="mb-4 p-3 bg-primary text-white rounded">
                <h1 className="mb-3">{track.Name}</h1>
                <p><strong>Price:</strong> {formattedPrice}</p>
                <p><strong>Length:</strong> {formatDuration(track.Milliseconds)}</p>
            </div>

            {/* TrackCard Component */}
            <TrackCard
                track={track} // Pass the track data to TrackCard
                onEditClick={handleEditClick} // Handle edit action
                onDeleteClick={handleDeleteClick} // Handle delete action
            />
        </div>
    );
};

export default TrackView;
