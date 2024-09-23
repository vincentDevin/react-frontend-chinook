// src/tests/ArtistList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ArtistList from '../../../pages/artists/ArtistList';
import { artistApi } from '../../../api/entitiesApi';

// Mocking the API and ConfirmDeleteModal component
vi.mock('../api/entitiesApi');
vi.mock('../components/ConfirmDeleteModal', () => ({
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

describe('ArtistList component', () => {
  const mockArtists = [
    { id: 1, name: 'Artist 1' },
    { id: 2, name: 'Artist 2' },
  ];

  beforeEach(() => {
    artistApi.getAll.mockResolvedValue(mockArtists);
    artistApi.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <ArtistList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading artists...');
  });

  test('renders artists after loading', async () => {
    render(
      <MemoryRouter>
        <ArtistList />
      </MemoryRouter>
    );

    // Wait for artists to be displayed
    await waitFor(() => expect(screen.getByText('Artist 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Artist 2')).toBeInTheDocument());
  });

  test('displays error message on API error', async () => {
    artistApi.getAll.mockRejectedValueOnce(new Error('Failed to fetch artists'));

    render(
      <MemoryRouter>
        <ArtistList />
      </MemoryRouter>
    );

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch artists'));
  });

  test('shows confirm delete modal and deletes an artist', async () => {
    render(
      <MemoryRouter>
        <ArtistList />
      </MemoryRouter>
    );

    // Wait for artists to be displayed
    await waitFor(() => expect(screen.getByText('Artist 1')).toBeInTheDocument());

    // Click on the delete button for the first artist
    fireEvent.click(screen.getByLabelText('Delete artist Artist 1'));

    // Check if the modal is displayed
    await waitFor(() => expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument());
    expect(screen.getByText('Are you sure you want to delete Artist 1?')).toBeInTheDocument();

    // Confirm delete action
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    // Wait for the artist to be deleted
    await waitFor(() => expect(screen.queryByText('Artist 1')).not.toBeInTheDocument());

    // Check if delete API call was made
    expect(artistApi.delete).toHaveBeenCalledWith(1);
  });

  test('navigates to add artist page when "Add Artist" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <ArtistList />
      </MemoryRouter>
    );

    // Click on the Add Artist button
    fireEvent.click(screen.getByLabelText('Add a new artist'));

    // Check if the URL changed to "/artists/add"
    expect(container.innerHTML).toMatch(/Add Artist/);
  });

  test('navigates to edit artist page when "Edit" button is clicked', async () => {
    const navigateMock = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <MemoryRouter initialEntries={['/artists']}>
        <ArtistList />
      </MemoryRouter>
    );

    // Wait for artists to be displayed
    await waitFor(() => expect(screen.getByText('Artist 1')).toBeInTheDocument());

    // Click on the edit button for the first artist
    fireEvent.click(screen.getByLabelText('Edit artist Artist 1'));

    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/artists/1');
  });
});
