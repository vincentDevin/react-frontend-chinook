import PropTypes from 'prop-types';
import { getUserRoleFromToken } from '../../api/authUtils'; // Utility to get user role

// Utility function to format duration from milliseconds to "mm:ss"
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const TrackCard = ({ track, onEditClick, onDeleteClick }) => {
    const userRoleId = getUserRoleFromToken(); // Get user role from token
    const isAdmin = userRoleId === 3; // Only role ID 3 is admin

    return (
        <div className="p-3 track-card">
            <p><strong>Track:</strong> {track.Name}</p>
            <p><strong>Album:</strong> {track.AlbumTitle || 'Unknown Album'}</p>
            <p><strong>Genre:</strong> {track.GenreName || 'Unknown Genre'}</p>
            <p><strong>Media Type:</strong> {track.MediaTypeName || 'Unknown Media Type'}</p>
            <p><strong>Composer:</strong> {track.Composer || 'Unknown'}</p>
            <p><strong>Artist:</strong> {track.ArtistName || 'Unknown'}</p> 
            <p><strong>File Size:</strong> {track.Bytes ? `${(track.Bytes / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'}</p>
            <p><strong>Duration:</strong> {formatDuration(track.Milliseconds)}</p> {/* Added Duration Field */}
            
            {/* Only show edit and delete buttons if the user is an admin */}
            {isAdmin && (
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={onEditClick}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={onDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

TrackCard.propTypes = {
    track: PropTypes.object.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};

export default TrackCard;
