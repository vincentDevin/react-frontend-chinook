// src/tests/MediaTypeForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import MediaTypeForm from '../pages/media-types/MediaTypeForm';
import { mediaTypeApi } from '../api/entitiesApi';

// Mock the mediaTypeApi
vi.mock('../api/entitiesApi', () => ({
  mediaTypeApi: {
    getById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('MediaTypeForm component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Mock useNavigate hook
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders "Add New Media Type" form correctly', () => {
    render(
      <MemoryRouter>
        <MediaTypeForm />
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Add New Media Type"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Add New Media Type');
    expect(screen.getByLabelText('Media Type Name:')).toBeInTheDocument();
  });

  test('renders "Edit Media Type" form correctly when mediaTypeId is provided', async () => {
    const mockMediaType = { id: 1, name: 'Test Media Type' };
    mediaTypeApi.getById.mockResolvedValue(mockMediaType);

    render(
      <MemoryRouter initialEntries={['/media-types/1']}>
        <Routes>
          <Route path="/media-types/:mediaTypeId" element={<MediaTypeForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Edit Media Type"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Edit Media Type');

    // Wait for media type data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Media Type')).toBeInTheDocument());
  });

  test('shows validation error when form is submitted with empty field', async () => {
    render(
      <MemoryRouter>
        <MediaTypeForm />
      </MemoryRouter>
    );

    // Click the Save button without entering the media type name
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for validation error to be displayed
    await waitFor(() => expect(screen.getByText('Media Type name is required')).toBeInTheDocument());
  });

  test('submits the form successfully when adding a new media type', async () => {
    mediaTypeApi.insert.mockResolvedValue({});
    render(
      <MemoryRouter>
        <MediaTypeForm />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Media Type Name:'), { target: { value: 'New Media Type' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the insert API call to be made and navigate to media types list
    await waitFor(() => expect(mediaTypeApi.insert).toHaveBeenCalledWith({ name: 'New Media Type' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/media-types'));
  });

  test('submits the form successfully when editing a media type', async () => {
    const mockMediaType = { id: 1, name: 'Test Media Type' };
    mediaTypeApi.getById.mockResolvedValue(mockMediaType);
    mediaTypeApi.update.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/media-types/1']}>
        <Routes>
          <Route path="/media-types/:mediaTypeId" element={<MediaTypeForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for media type data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Media Type')).toBeInTheDocument());

    // Update the form field
    fireEvent.change(screen.getByLabelText('Media Type Name:'), { target: { value: 'Updated Media Type' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the update API call to be made and navigate to media types list
    await waitFor(() => expect(mediaTypeApi.update).toHaveBeenCalledWith({ id: 1, name: 'Updated Media Type' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/media-types'));
  });

  test('navigates back to the media types list when "CANCEL" button is clicked', () => {
    render(
      <MemoryRouter>
        <MediaTypeForm />
      </MemoryRouter>
    );

    // Click the Cancel button
    fireEvent.click(screen.getByLabelText('Cancel and go back to media types list'));

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/media-types');
  });
});
