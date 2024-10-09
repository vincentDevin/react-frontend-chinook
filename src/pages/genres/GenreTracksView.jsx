import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import { trackApi, genreApi } from '../../api/entitiesApi'; // Import genreApi for fetching genre details
import GenericPagination from '../../components/GenericPagination'; // Assuming you have pagination component
import TrackCard from '../tracks/TrackCard'; // Import TrackCard for displaying track details

const GenreTracksView = () => {
    const { genreId } = useParams(); // Get genreId from the route
    const [tracks, setTracks] = useState([]);
    const [genreName, setGenreName] = useState(''); // State to store genre name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const [expandedTrackId, setExpandedTrackId] = useState(null); // State to track which track is expanded
    const navigate = useNavigate(); // Add useNavigate for navigation
    const limit = 10; // Number of tracks per page

    // Fetch genre name and tracks with pagination when the component mounts or page changes
    useEffect(() => {
        const fetchTracksAndGenre = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous error

                // Fetch genre details to get the genre name
                const genreData = await genreApi.getById(genreId);
                if (genreData) {
                    setGenreName(genreData.Name);
                }

                // Fetch tracks by genre with pagination
                const tracksData = await trackApi.getAllByGenreId(genreId, limit, (currentPage - 1) * limit);
                if (tracksData) {
                    setTracks(tracksData.tracks || []);
                    setTotalPages(tracksData.totalPages || 1);
                }

            } catch (err) {
                console.error('Error fetching tracks or genre:', err);
                setError('Failed to load tracks or genre details');
            } finally {
                setLoading(false);
            }
        };

        fetchTracksAndGenre(); // Invoke the function inside useEffect
    }, [genreId, currentPage]); // Dependency array includes genreId and currentPage

    // Handle track click to toggle expanded view
    const handleTrackClick = (trackId) => {
        setExpandedTrackId((prevExpandedTrackId) =>
            prevExpandedTrackId === trackId ? null : trackId
        );
    };

    // Handle page change for pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className="container mt-4">Loading tracks...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger">{error}</div>;
    }

    if (!tracks.length) {
        return <div className="container mt-4">No tracks available for this genre</div>;
    }

    return (
        <div className="container mt-4 genre-tracks-view">
            <h1>Tracks for {genreName}</h1> {/* Display the genre name */}
            <ul className="list-group">
                {tracks.map((track) => (
                    <li key={track.TrackId} className="list-group-item">
                        <div
                            className="d-flex justify-content-between align-items-center"
                            onClick={() => handleTrackClick(track.TrackId)} // Click handler to toggle view
                        >
                            <div>
                                {track.Name} - {track.ArtistName} ({track.AlbumTitle})
                            </div>
                            <button className="btn btn-primary btn-sm">
                                {expandedTrackId === track.TrackId ? 'Collapse' : 'View'}
                            </button>
                        </div>

                        {/* Conditionally render TrackCard with full track details when expanded */}
                        {expandedTrackId === track.TrackId && (
                            <div className="mt-3">
                                <TrackCard
                                    track={track} // Pass the full track data to TrackCard
                                    onEditClick={() => navigate(`/tracks/${track.TrackId}/edit`)} // Navigate to track edit form
                                    onDeleteClick={() => console.log('Delete clicked')} // Add your delete logic
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Pagination Component */}
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default GenreTracksView;
