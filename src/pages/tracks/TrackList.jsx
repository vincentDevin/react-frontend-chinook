import { useNavigate } from 'react-router-dom';
import { trackApi, albumApi, genreApi, mediaTypeApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import { useEffect, useState } from 'react';

// Duration formatter function
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const TrackList = () => {
    const navigate = useNavigate();

    // Use the custom pagination hook with the track API function
    const {
        items: tracks = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(trackApi.getAll, 10, 'tracks'); // Pass 'tracks' as the dataKey

    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    useEffect(() => {
        const fetchRelatedData = async () => {
            try {
                const [albumResponse, genreResponse, mediaTypeResponse] = await Promise.all([
                    albumApi.getAll(),
                    genreApi.getAll(),
                    mediaTypeApi.getAll(),
                ]);
                setAlbums(albumResponse.albums || albumResponse); // Ensure albums is an array
                setGenres(genreResponse.genres || genreResponse); // Ensure genres is an array
                setMediaTypes(mediaTypeResponse.mediaTypes || mediaTypeResponse); // Ensure mediaTypes is an array
            } catch (err) {
                console.error('Error fetching related data:', err);
            }
        };

        fetchRelatedData();
    }, []);

    const handleShowModal = (track) => {
        setSelectedTrack(track);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrack(null);
    };

    const handleConfirmDelete = () => {
        if (selectedTrack) {
            trackApi
                .delete(selectedTrack.TrackId)
                .then(() => {
                    handlePageChange(currentPage); // Refresh data after deleting a track
                    handleCloseModal();
                })
                .catch((err) => {
                    console.error(err.message);
                });
        }
    };

    const getAlbumTitle = (albumId) => {
        const album = albums.find((a) => a.AlbumId === albumId);
        return album ? album.Title : 'Unknown Album';
    };

    const getGenreName = (genreId) => {
        const genre = genres.find((g) => g.GenreId === genreId);
        return genre ? genre.Name : 'Unknown Genre';
    };

    const getMediaTypeName = (mediaTypeId) => {
        const mediaType = mediaTypes.find((m) => m.MediaTypeId === mediaTypeId);
        return mediaType ? mediaType.Name : 'Unknown Media Type';
    };

    const renderRow = (track) => (
        <tr key={track.TrackId}>
            <td>{track.Name}</td>
            <td>{getAlbumTitle(track.AlbumId)}</td>
            <td>{getGenreName(track.GenreId)}</td>
            <td>{getMediaTypeName(track.MediaTypeId)}</td>
            <td>{track.Composer || 'Unknown'}</td>
            <td>{formatDuration(track.Milliseconds)}</td>
            <td>{track.UnitPrice !== undefined ? `$${parseFloat(track.UnitPrice).toFixed(2)}` : 'N/A'}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/tracks/' + track.TrackId)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowModal(track)}
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading tracks...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <GenericActions
                onAdd={() => navigate('/tracks/add')}
                selectedItem={selectedTrack}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCloseModal}
                showModal={showModal}
                addLink="/tracks/add"
            />

            <GenericTable
                headers={['Track', 'Album', 'Genre', 'Media Type', 'Composer', 'Duration (mm:ss)', 'Price ($)', 'Actions']}
                rows={tracks} // Ensure rows is passed correctly from the hook
                renderRow={renderRow}
            />

            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default TrackList;
