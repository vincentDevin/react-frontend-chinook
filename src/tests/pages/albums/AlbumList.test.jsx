// src/tests/AlbumList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AlbumList from '../../../pages/albums/AlbumList';
import { albumApi } from '../../../api/entitiesApi';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

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

describe('AlbumList component', () => {
  const mockAlbums = [
    { id: 1, title: 'Album 1', artist: 'Artist 1' },
    { id: 2, title: 'Album 2', artist: 'Artist 2' },
  ];

  beforeEach(() => {
    albumApi.getAll.mockResolvedValue(mockAlbums);
    albumApi.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <AlbumList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading albums...');
  });

  test('renders albums after loading', async () => {
    render(
      <MemoryRouter>
        <AlbumList />
      </MemoryRouter>
    );

    // Wait for albums to be displayed
    await waitFor(() => expect(screen.getByText('Album 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Album 2')).toBeInTheDocument());
  });

  test('displays error message on API error', async () => {
    albumApi.getAll.mockRejectedValueOnce(new Error('Failed to fetch albums'));

    render(
      <MemoryRouter>
        <AlbumList />
      </MemoryRouter>
    );

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch albums'));
  });

  test('shows confirm delete modal and deletes an album', async () => {
    render(
      <MemoryRouter>
        <AlbumList />
      </MemoryRouter>
    );

    // Wait for albums to be displayed
    await waitFor(() => expect(screen.getByText('Album 1')).toBeInTheDocument());

    // Click on the delete button for the first album
    fireEvent.click(screen.getByLabelText('Delete Album 1 album'));

    // Check if the modal is displayed
    await waitFor(() => expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument());
    expect(screen.getByText('Are you sure you want to delete Album 1?')).toBeInTheDocument();

    // Confirm delete action
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    // Wait for the album to be deleted
    await waitFor(() => expect(screen.queryByText('Album 1')).not.toBeInTheDocument());

    // Check if delete API call was made
    expect(albumApi.delete).toHaveBeenCalledWith(1);
  });

  test('navigates to add album page when "Add Album" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <AlbumList />
      </MemoryRouter>
    );

    // Click on the Add Album button
    fireEvent.click(screen.getByLabelText('Add new album'));

    // Check if the URL changed to "/albums/add"
    expect(container.innerHTML).toMatch(/Add Album/);
  });

  test('navigates to edit album page when "Edit" button is clicked', async () => {
    const navigateMock = vi.fn();
    render(
      <MemoryRouter initialEntries={['/albums']}>
        <AlbumList navigate={navigateMock} />
      </MemoryRouter>
    );

    // Wait for albums to be displayed
    await waitFor(() => expect(screen.getByText('Album 1')).toBeInTheDocument());

    // Click on the edit button for the first album
    fireEvent.click(screen.getByLabelText('Edit Album 1 album'));

    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/albums/1');
  });
});
