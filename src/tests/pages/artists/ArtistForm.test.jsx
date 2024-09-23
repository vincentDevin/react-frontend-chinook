// src/tests/ArtistForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ArtistForm from '../../../pages/artists/ArtistForm';
import { artistApi } from '../../../api/entitiesApi';

// Mock the artistApi
vi.mock('../api/entitiesApi', () => ({
  artistApi: {
    getById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('ArtistForm component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Mock useNavigate hook
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders "Add New Artist" form correctly', () => {
    render(
      <MemoryRouter>
        <ArtistForm />
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Add New Artist"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Add New Artist');
    expect(screen.getByLabelText('Artist Name:')).toBeInTheDocument();
  });

  test('renders "Edit Artist" form correctly when artistId is provided', async () => {
    const mockArtist = { id: 1, name: 'Test Artist' };
    artistApi.getById.mockResolvedValue(mockArtist);

    render(
      <MemoryRouter initialEntries={['/artists/1']}>
        <Routes>
          <Route path="/artists/:artistId" element={<ArtistForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Edit Artist"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Edit Artist');

    // Wait for artist data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Artist')).toBeInTheDocument());
  });

  test('shows validation error when form is submitted with empty field', async () => {
    render(
      <MemoryRouter>
        <ArtistForm />
      </MemoryRouter>
    );

    // Click the Save button without entering the artist name
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for validation error to be displayed
    await waitFor(() => expect(screen.getByText('Artist name is required')).toBeInTheDocument());
  });

  test('submits the form successfully when adding a new artist', async () => {
    artistApi.insert.mockResolvedValue({});
    render(
      <MemoryRouter>
        <ArtistForm />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Artist Name:'), { target: { value: 'New Artist' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the insert API call to be made and navigate to artists list
    await waitFor(() => expect(artistApi.insert).toHaveBeenCalledWith({ name: 'New Artist' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/artists'));
  });

  test('submits the form successfully when editing an artist', async () => {
    const mockArtist = { id: 1, name: 'Test Artist' };
    artistApi.getById.mockResolvedValue(mockArtist);
    artistApi.update.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/artists/1']}>
        <Routes>
          <Route path="/artists/:artistId" element={<ArtistForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for artist data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Artist')).toBeInTheDocument());

    // Update the form field
    fireEvent.change(screen.getByLabelText('Artist Name:'), { target: { value: 'Updated Artist' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the update API call to be made and navigate to artists list
    await waitFor(() => expect(artistApi.update).toHaveBeenCalledWith({ id: 1, name: 'Updated Artist' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/artists'));
  });

  test('navigates back to the artists list when "CANCEL" button is clicked', () => {
    render(
      <MemoryRouter>
        <ArtistForm />
      </MemoryRouter>
    );

    // Click the Cancel button
    fireEvent.click(screen.getByLabelText('Cancel and go back to artist list'));

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/artists');
  });
});
