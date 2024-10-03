import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TrackCard from './TrackCard'; // Import the TrackCard component

// Duration formatter function
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const TrackRow = ({ track, isSelected, onRowClick, onDeleteClick }) => {
    const navigate = useNavigate();

    return (
        <>
            {/* Main row with custom style for selected */}
            <tr 
                onClick={onRowClick} 
                className={`cursor-pointer ${isSelected ? 'bg-primary text-white' : ''}`} // Apply Bootstrap classes for selected state
            >
                <td className="fixed-width">{track.Name}</td>
                <td className="fixed-width">{formatDuration(track.Milliseconds)}</td>
                <td className="fixed-width">{track.UnitPrice !== undefined ? `$${parseFloat(track.UnitPrice).toFixed(2)}` : 'N/A'}</td>
            </tr>
            {/* Expanded view: TrackCard */}
            {isSelected && (
                <tr>
                    <td colSpan="3">
                        <TrackCard 
                            track={track} // Pass the entire track object, including duration
                            onEditClick={(e) => {
                                e.stopPropagation(); // Prevent row click from toggling expanded state
                                navigate('/tracks/' + track.TrackId);
                            }}
                            onDeleteClick={(e) => {
                                e.stopPropagation(); // Prevent row click from toggling expanded state
                                onDeleteClick(); // Call delete click handler to show the modal
                            }}
                        />
                    </td>
                </tr>
            )}
        </>
    );
};

TrackRow.propTypes = {
    track: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
};

export default TrackRow;
