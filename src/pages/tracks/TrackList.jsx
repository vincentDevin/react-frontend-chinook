import { useState } from 'react';
import { trackApi } from '../../api/entitiesApi';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';
import TrackRow from './TrackRow'; // Import TrackRow component
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal'; // Import ConfirmDeleteModal component

const TrackList = () => {
    const {
        items: tracks = [],
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(trackApi.getAll, 10, 'tracks'); // Pass 'tracks' as the dataKey

    const [selectedTrack, setSelectedTrack] = useState(null); // State for the selected track row
    const [trackToDelete, setTrackToDelete] = useState(null); // State for the track to be deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for controlling the delete modal

    // Handle row selection for expanding details
    const handleRowClick = (track) => {
        setSelectedTrack(track.TrackId === selectedTrack?.TrackId ? null : track);
    };

    // Handle delete button click in TrackRow
    const handleDeleteClick = (track) => {
        setTrackToDelete(track);
        setShowDeleteModal(true);
    };

    // Handle confirm delete in modal
    const handleDeleteConfirmed = async () => {
        if (trackToDelete) {
            try {
                await trackApi.delete(trackToDelete.TrackId); // Call the delete API function
                handlePageChange(currentPage); // Refresh the data
                setShowDeleteModal(false); // Close the modal after deleting
                setTrackToDelete(null); // Reset the track to delete state
                setSelectedTrack(null); // Reset the selected track
            } catch (err) {
                console.error('Error deleting track:', err.message);
            }
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTrackToDelete(null); // Reset the track to delete state when closing the modal
    };

    const renderRow = (track) => (
        <TrackRow
            key={track.TrackId}
            track={track}
            isSelected={track.TrackId === selectedTrack?.TrackId}
            onRowClick={() => handleRowClick(track)}
            onDeleteClick={() => handleDeleteClick(track)} // Pass the delete handler to TrackRow
        />
    );

    if (loading) {
        return <div className="container mt-4">Loading tracks...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <GenericTable
                headers={['Track', 'Duration (mm:ss)', 'Price ($)']}
                rows={tracks}
                renderRow={renderRow}
            />
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange} // Removed animation concerns from here
            />
            <ConfirmDeleteModal
                show={showDeleteModal}
                handleClose={handleCloseModal}
                handleConfirm={handleDeleteConfirmed}
                itemName={trackToDelete ? trackToDelete.Name : ''}
            />
        </div>
    );
};

export default TrackList;
