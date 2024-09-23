// src/tests/TrackList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import TrackList from '../../../pages/tracks/TrackList';
import { trackApi } from '../../../api/entitiesApi';

// Mocking the API and ConfirmDeleteModal component
vi.mock('../../../api/entitiesApi');
vi.mock('../../../components/ConfirmDeleteModal', () => ({
  __esModule: true,
  default: ({ show, handleClose, handleConfirm, itemName }) => (
    <div data-testid="confirm-delete-modal">
      {show && (
        <div>
          <p>Are you sure you want to delete {itemName}?</p>
          <button onClick={handleConfirm} aria-label="Confirm delete">Confirm</button>
          <button onClick={handleClose} aria-label="Close modal">Cancel</button>
        </div>
      )}
    </div>
  ),
}));

describe('TrackList component', () => {
  const mockTracks = [
    { id: 1, name: 'Track 1', album: 'Album 1', genre: 'Rock', mediaType: 'CD', milliseconds: 180000, price: 1.99 },
    { id: 2, name: 'Track 2', album: 'Album 2', genre: 'Jazz', mediaType: 'Vinyl', milliseconds: 210000, price: 2.49 },
  ];

  beforeEach(() => {
    trackApi.getAll.mockResolvedValue(mockTracks);
    trackApi.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <TrackList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading tracks...');
  });

  test('renders tracks after loading', async () => {
    render(
      <MemoryRouter>
        <TrackList />
      </MemoryRouter>
    );

    // Wait for tracks to be displayed
    await waitFor(() => expect(screen.getByText('Track 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Track 2')).toBeInTheDocument());
    expect(screen.getByText('3:00')).toBeInTheDocument(); // Check formatted duration
    expect(screen.getByText('3:30')).toBeInTheDocument(); // Check formatted duration
  });

  test('displays error message on API error', async () => {
    trackApi.getAll.mockRejectedValueOnce(new Error('Failed to fetch tracks'));

    render(
      <MemoryRouter>
        <TrackList />
      </MemoryRouter>
    );

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch tracks'));
  });

  test('shows confirm delete modal and deletes a track', async () => {
    render(
      <MemoryRouter>
        <TrackList />
      </MemoryRouter>
    );

    // Wait for tracks to be displayed
    await waitFor(() => expect(screen.getByText('Track 1')).toBeInTheDocument());

    // Click on the delete button for the first track
    fireEvent.click(screen.getByLabelText('Delete Track 1'));

    // Check if the modal is displayed
    await waitFor(() => expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument());
    expect(screen.getByText('Are you sure you want to delete Track 1?')).toBeInTheDocument();

    // Confirm delete action
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    // Wait for the track to be deleted
    await waitFor(() => expect(screen.queryByText('Track 1')).not.toBeInTheDocument());

    // Check if delete API call was made
    expect(trackApi.delete).toHaveBeenCalledWith(1);
  });

  test('navigates to add track page when "Add Track" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <TrackList />
      </MemoryRouter>
    );

    // Click on the Add Track button
    fireEvent.click(screen.getByLabelText('Add new track'));

    // Check if the URL changed to "/tracks/add"
    expect(container.innerHTML).toMatch(/Add Track/);
  });

  test('navigates to edit track page when "Edit" button is clicked', async () => {
    const navigateMock = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <MemoryRouter initialEntries={['/tracks']}>
        <TrackList />
      </MemoryRouter>
    );

    // Wait for tracks to be displayed
    await waitFor(() => expect(screen.getByText('Track 1')).toBeInTheDocument());

    // Click on the edit button for the first track
    fireEvent.click(screen.getByLabelText('Edit Track 1'));

    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/tracks/1');
  });
});
