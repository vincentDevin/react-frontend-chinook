// src/tests/AlbumForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import AlbumForm from '../pages/albums/AlbumForm';
import { albumApi } from '../api/entitiesApi';
import albumValidationSchema from '../validation/albumValidationSchema';

vi.mock('../api/entitiesApi');
vi.mock('../validation/albumValidationSchema');

describe('AlbumForm component', () => {
  const mockNavigate = vi.fn();
  const mockAlbum = { id: 1, title: 'Test Album', artist: 'Test Artist' };

  beforeEach(() => {
    albumApi.getById.mockResolvedValue(mockAlbum);
    albumApi.update.mockResolvedValue({});
    albumApi.insert.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (route = '/albums/add') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/albums/add" element={<AlbumForm />} />
          <Route path="/albums/edit/:albumId" element={<AlbumForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders add new album form', () => {
    renderComponent();

    expect(screen.getByText('Add New Album')).toBeInTheDocument();
    expect(screen.getByLabelText('Album Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Artist:')).toBeInTheDocument();
  });

  test('renders edit album form with pre-filled values', async () => {
    renderComponent('/albums/edit/1');

    // Wait for the API to fetch album data and populate the form
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Album')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Artist')).toBeInTheDocument();
    });

    expect(screen.getByText('Edit Album')).toBeInTheDocument();
  });

  test('shows validation errors if the form is submitted with empty fields', async () => {
    renderComponent();

    // Submit the form without filling in fields
    fireEvent.click(screen.getByLabelText('Save album'));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument(); // Assuming the validation schema shows "required" messages
    });
  });

  test('submits form data for adding a new album', async () => {
    renderComponent();

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Album Name:'), { target: { value: 'New Album' } });
    fireEvent.change(screen.getByLabelText('Artist:'), { target: { value: 'New Artist' } });

    // Submit the form
    fireEvent.click(screen.getByLabelText('Save album'));

    await waitFor(() => {
      expect(albumApi.insert).toHaveBeenCalledWith({ name: 'New Album', artist: 'New Artist' });
      expect(mockNavigate).toHaveBeenCalledWith('/albums');
    });
  });

  test('submits form data for editing an existing album', async () => {
    renderComponent('/albums/edit/1');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Album')).toBeInTheDocument();
    });

    // Update the form fields
    fireEvent.change(screen.getByLabelText('Album Name:'), { target: { value: 'Updated Album' } });
    fireEvent.change(screen.getByLabelText('Artist:'), { target: { value: 'Updated Artist' } });

    // Submit the form
    fireEvent.click(screen.getByLabelText('Save album'));

    await waitFor(() => {
      expect(albumApi.update).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Album',
        artist: 'Updated Artist',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/albums');
    });
  });

  test('navigates back to albums list on cancel', () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText('Cancel and go back to albums list'));

    expect(mockNavigate).toHaveBeenCalledWith('/albums');
  });
});
