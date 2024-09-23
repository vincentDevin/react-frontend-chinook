// src/tests/GenreList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import GenreList from '../../../pages/genres/GenreList';
import { genreApi } from '../../../api/entitiesApi';

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

describe('GenreList component', () => {
  const mockGenres = [
    { id: 1, name: 'Rock' },
    { id: 2, name: 'Jazz' },
  ];

  beforeEach(() => {
    genreApi.getAll.mockResolvedValue(mockGenres);
    genreApi.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <GenreList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading genres...');
  });

  test('renders genres after loading', async () => {
    render(
      <MemoryRouter>
        <GenreList />
      </MemoryRouter>
    );

    // Wait for genres to be displayed
    await waitFor(() => expect(screen.getByText('Rock')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Jazz')).toBeInTheDocument());
  });

  test('displays error message on API error', async () => {
    genreApi.getAll.mockRejectedValueOnce(new Error('Failed to fetch genres'));

    render(
      <MemoryRouter>
        <GenreList />
      </MemoryRouter>
    );

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch genres'));
  });

  test('shows confirm delete modal and deletes a genre', async () => {
    render(
      <MemoryRouter>
        <GenreList />
      </MemoryRouter>
    );

    // Wait for genres to be displayed
    await waitFor(() => expect(screen.getByText('Rock')).toBeInTheDocument());

    // Click on the delete button for the first genre
    fireEvent.click(screen.getByLabelText('Delete genre Rock'));

    // Check if the modal is displayed
    await waitFor(() => expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument());
    expect(screen.getByText('Are you sure you want to delete Rock?')).toBeInTheDocument();

    // Confirm delete action
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    // Wait for the genre to be deleted
    await waitFor(() => expect(screen.queryByText('Rock')).not.toBeInTheDocument());

    // Check if delete API call was made
    expect(genreApi.delete).toHaveBeenCalledWith(1);
  });

  test('navigates to add genre page when "Add Genre" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <GenreList />
      </MemoryRouter>
    );

    // Click on the Add Genre button
    fireEvent.click(screen.getByLabelText('Add a new genre'));

    // Check if the URL changed to "/genres/add"
    expect(container.innerHTML).toMatch(/Add Genre/);
  });

  test('navigates to edit genre page when "Edit" button is clicked', async () => {
    const navigateMock = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <MemoryRouter initialEntries={['/genres']}>
        <GenreList />
      </MemoryRouter>
    );

    // Wait for genres to be displayed
    await waitFor(() => expect(screen.getByText('Rock')).toBeInTheDocument());

    // Click on the edit button for the first genre
    fireEvent.click(screen.getByLabelText('Edit genre Rock'));

    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/genres/1');
  });
});
