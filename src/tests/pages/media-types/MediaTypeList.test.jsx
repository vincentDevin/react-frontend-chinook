// src/tests/MediaTypeList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MediaTypeList from '../../../pages/media-types/MediaTypeList';
import { mediaTypeApi } from '../../../api/entitiesApi';

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

describe('MediaTypeList component', () => {
  const mockMediaTypes = [
    { id: 1, name: 'CD' },
    { id: 2, name: 'Vinyl' },
  ];

  beforeEach(() => {
    mediaTypeApi.getAll.mockResolvedValue(mockMediaTypes);
    mediaTypeApi.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <MediaTypeList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading media types...');
  });

  test('renders media types after loading', async () => {
    render(
      <MemoryRouter>
        <MediaTypeList />
      </MemoryRouter>
    );

    // Wait for media types to be displayed
    await waitFor(() => expect(screen.getByText('CD')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Vinyl')).toBeInTheDocument());
  });

  test('displays error message on API error', async () => {
    mediaTypeApi.getAll.mockRejectedValueOnce(new Error('Failed to fetch media types'));

    render(
      <MemoryRouter>
        <MediaTypeList />
      </MemoryRouter>
    );

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch media types'));
  });

  test('shows confirm delete modal and deletes a media type', async () => {
    render(
      <MemoryRouter>
        <MediaTypeList />
      </MemoryRouter>
    );

    // Wait for media types to be displayed
    await waitFor(() => expect(screen.getByText('CD')).toBeInTheDocument());

    // Click on the delete button for the first media type
    fireEvent.click(screen.getByLabelText('Delete CD'));

    // Check if the modal is displayed
    await waitFor(() => expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument());
    expect(screen.getByText('Are you sure you want to delete CD?')).toBeInTheDocument();

    // Confirm delete action
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    // Wait for the media type to be deleted
    await waitFor(() => expect(screen.queryByText('CD')).not.toBeInTheDocument());

    // Check if delete API call was made
    expect(mediaTypeApi.delete).toHaveBeenCalledWith(1);
  });

  test('navigates to add media type page when "Add Media Type" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <MediaTypeList />
      </MemoryRouter>
    );

    // Click on the Add Media Type button
    fireEvent.click(screen.getByLabelText('Add a new media type'));

    // Check if the URL changed to "/media-types/add"
    expect(container.innerHTML).toMatch(/Add Media Type/);
  });

  test('navigates to edit media type page when "Edit" button is clicked', async () => {
    const navigateMock = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <MemoryRouter initialEntries={['/media-types']}>
        <MediaTypeList />
      </MemoryRouter>
    );

    // Wait for media types to be displayed
    await waitFor(() => expect(screen.getByText('CD')).toBeInTheDocument());

    // Click on the edit button for the first media type
    fireEvent.click(screen.getByLabelText('Edit CD'));

    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/media-types/1');
  });
});
