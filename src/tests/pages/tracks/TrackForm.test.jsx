// src/tests/TrackForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import TrackForm from '../../../pages/tracks/TrackForm';
import { trackApi } from '../../../api/entitiesApi';

// Mock the trackApi
vi.mock('../../../api/entitiesApi', () => ({
  trackApi: {
    getById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('TrackForm component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Mock useNavigate hook
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders "Add New Track" form correctly', () => {
    render(
      <MemoryRouter>
        <TrackForm />
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Add New Track"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Add New Track');
    expect(screen.getByLabelText('Track Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Album:')).toBeInTheDocument();
    expect(screen.getByLabelText('Genre:')).toBeInTheDocument();
    expect(screen.getByLabelText('Media Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration (ms):')).toBeInTheDocument();
    expect(screen.getByLabelText('Price ($):')).toBeInTheDocument();
  });

  test('renders "Edit Track" form correctly when trackId is provided', async () => {
    const mockTrack = {
      id: 1,
      name: 'Test Track',
      album: 'Test Album',
      genre: 'Rock',
      mediaType: 'CD',
      milliseconds: 180000,
      price: 1.99,
    };
    trackApi.getById.mockResolvedValue(mockTrack);

    render(
      <MemoryRouter initialEntries={['/tracks/1']}>
        <Routes>
          <Route path="/tracks/:trackId" element={<TrackForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Edit Track"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Edit Track');

    // Wait for track data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Track')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Test Album')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rock')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('180000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.99')).toBeInTheDocument();
  });

  test('shows validation errors when form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <TrackForm />
      </MemoryRouter>
    );

    // Click the Save button without entering any data
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText('Track name is required')).toBeInTheDocument();
      expect(screen.getByText('Album is required')).toBeInTheDocument();
      expect(screen.getByText('Genre is required')).toBeInTheDocument();
      expect(screen.getByText('Media type is required')).toBeInTheDocument();
      expect(screen.getByText('Duration is required')).toBeInTheDocument();
      expect(screen.getByText('Price is required')).toBeInTheDocument();
    });
  });

  test('submits the form successfully when adding a new track', async () => {
    trackApi.insert.mockResolvedValue({});
    render(
      <MemoryRouter>
        <TrackForm />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Track Name:'), { target: { value: 'New Track' } });
    fireEvent.change(screen.getByLabelText('Album:'), { target: { value: 'New Album' } });
    fireEvent.change(screen.getByLabelText('Genre:'), { target: { value: 'Jazz' } });
    fireEvent.change(screen.getByLabelText('Media Type:'), { target: { value: 'Vinyl' } });
    fireEvent.change(screen.getByLabelText('Duration (ms):'), { target: { value: '210000' } });
    fireEvent.change(screen.getByLabelText('Price ($):'), { target: { value: '2.49' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the insert API call to be made and navigate to tracks list
    await waitFor(() =>
      expect(trackApi.insert).toHaveBeenCalledWith({
        name: 'New Track',
        album: 'New Album',
        genre: 'Jazz',
        mediaType: 'Vinyl',
        milliseconds: 210000,
        price: 2.49,
      })
    );
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/tracks'));
  });

  test('submits the form successfully when editing a track', async () => {
    const mockTrack = {
      id: 1,
      name: 'Test Track',
      album: 'Test Album',
      genre: 'Rock',
      mediaType: 'CD',
      milliseconds: 180000,
      price: 1.99,
    };
    trackApi.getById.mockResolvedValue(mockTrack);
    trackApi.update.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/tracks/1']}>
        <Routes>
          <Route path="/tracks/:trackId" element={<TrackForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for track data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Track')).toBeInTheDocument());

    // Update the form fields
    fireEvent.change(screen.getByLabelText('Track Name:'), { target: { value: 'Updated Track' } });
    fireEvent.change(screen.getByLabelText('Album:'), { target: { value: 'Updated Album' } });
    fireEvent.change(screen.getByLabelText('Genre:'), { target: { value: 'Pop' } });
    fireEvent.change(screen.getByLabelText('Media Type:'), { target: { value: 'Cassette' } });
    fireEvent.change(screen.getByLabelText('Duration (ms):'), { target: { value: '220000' } });
    fireEvent.change(screen.getByLabelText('Price ($):'), { target: { value: '2.99' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the update API call to be made and navigate to tracks list
    await waitFor(() =>
      expect(trackApi.update).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Track',
        album: 'Updated Album',
        genre: 'Pop',
        mediaType: 'Cassette',
        milliseconds: 220000,
        price: 2.99,
      })
    );
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/tracks'));
  });

  test('navigates back to the tracks list when "CANCEL" button is clicked', () => {
    render(
      <MemoryRouter>
        <TrackForm />
      </MemoryRouter>
    );

    // Click the Cancel button
    fireEvent.click(screen.getByText('CANCEL'));

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/tracks');
  });
});
