import PropTypes from 'prop-types';
import { getUserRoleFromToken } from '../../api/authUtils'; // Utility to get user role

const ArtistCard = ({ artist, onEditClick, onDeleteClick }) => {
    const userRoleId = getUserRoleFromToken(); // Get user role from token
    const isAdmin = userRoleId === 3; // Only role ID 3 is admin

    return (
        <div className="p-3 bg-light border rounded">
            <p><strong>Artist:</strong> {artist.Name}</p>
            <p><strong>Genre:</strong> {artist.Genre || 'Unknown Genre'}</p>
            <p><strong>Number of Albums:</strong> {artist.AlbumCount || 0}</p>
            <p><strong>Biography:</strong> {artist.Biography || 'No biography available'}</p>

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

ArtistCard.propTypes = {
    artist: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Genre: PropTypes.string,
        AlbumCount: PropTypes.number,
        Biography: PropTypes.string,
    }).isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};

export default ArtistCard;
