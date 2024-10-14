import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { trackApi, genreApi } from '../../api/entitiesApi';
import GenericPagination from '../../components/GenericPagination';
import TrackCard from '../tracks/TrackCard';

const GenreTracksView = () => {
    const { genreId } = useParams();
    const [tracks, setTracks] = useState([]);
    const [genreName, setGenreName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedTrackId, setExpandedTrackId] = useState(null);
    const navigate = useNavigate();
    const limit = 10;

    useEffect(() => {
        const fetchTracksAndGenre = async () => {
            try {
                setLoading(true);
                setError(null);

                const genreData = await genreApi.getById(genreId);
                if (genreData) {
                    setGenreName(genreData.Name);
                }

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

        fetchTracksAndGenre();
    }, [genreId, currentPage]);

    const handleTrackClick = (trackId) => {
        setExpandedTrackId((prevExpandedTrackId) =>
            prevExpandedTrackId === trackId ? null : trackId
        );
    };

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
            <h1>Tracks for {genreName}</h1>
            <ul className="list-group">
                {tracks.map((track) => (
                    <li key={track.TrackId} className={`list-group-item track-item ${expandedTrackId === track.TrackId ? 'expanded' : ''}`}>
                        <div
                            className="d-flex justify-content-between align-items-center track-summary"
                            onClick={() => handleTrackClick(track.TrackId)}
                        >
                            <div>
                                {track.Name} - {track.ArtistName} ({track.AlbumTitle})
                            </div>
                            <button className="btn btn-primary btn-sm">
                                {expandedTrackId === track.TrackId ? 'Collapse' : 'View'}
                            </button>
                        </div>

                        {expandedTrackId === track.TrackId && (
                            <div className="mt-3 track-details">
                                <TrackCard
                                    track={track}
                                    onEditClick={() => navigate(`/tracks/${track.TrackId}/edit`)}
                                    onDeleteClick={() => console.log('Delete clicked')}
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default GenreTracksView;
