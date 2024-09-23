// src/tests/RandomSpotlight.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RandomSpotlight from '../../components/RandomSpotlight';
import { artistApi, albumApi, trackApi } from '../../api/entitiesApi';

// Mock the API
vi.mock('../../api/entitiesApi', () => ({
  artistApi: {
    getAll: vi.fn(),
  },
  albumApi: {
    getAll: vi.fn(),
  },
  trackApi: {
    getAll: vi.fn(),
  },
}));

describe('RandomSpotlight component', () => {
  const mockArtist = { id: 1, name: 'Test Artist', genre: 'Rock' };
  const mockAlbum = { id: 2, title: 'Test Album', artist: 'Test Artist' };
  const mockTrack = { id: 3, name: 'Test Track', album: 'Test Album' };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders spotlight artist correctly', async () => {
    artistApi.getAll.mockResolvedValue([mockArtist]);
    albumApi.getAll.mockResolvedValue([]);
    trackApi.getAll.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    // Wait for the artist spotlight to be displayed
    await waitFor(() => expect(screen.getByText('Spotlight Artist: Test Artist')).toBeInTheDocument());
    expect(screen.getByText('Genre: Rock')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Artist' })).toHaveAttribute('href', '/artists/1');
  });

  test('renders spotlight album correctly', async () => {
    artistApi.getAll.mockResolvedValue([]);
    albumApi.getAll.mockResolvedValue([mockAlbum]);
    trackApi.getAll.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    // Wait for the album spotlight to be displayed
    await waitFor(() => expect(screen.getByText('Spotlight Album: Test Album')).toBeInTheDocument());
    expect(screen.getByText('By: Test Artist')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Album' })).toHaveAttribute('href', '/albums/2');
  });

  test('renders spotlight track correctly', async () => {
    artistApi.getAll.mockResolvedValue([]);
    albumApi.getAll.mockResolvedValue([]);
    trackApi.getAll.mockResolvedValue([mockTrack]);

    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    // Wait for the track spotlight to be displayed
    await waitFor(() => expect(screen.getByText('Spotlight Track: Test Track')).toBeInTheDocument());
    expect(screen.getByText('Album: Test Album')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Track' })).toHaveAttribute('href', '/tracks/3');
  });

  test('handles API error gracefully', async () => {
    artistApi.getAll.mockRejectedValue(new Error('Failed to fetch artists'));
    albumApi.getAll.mockRejectedValue(new Error('Failed to fetch albums'));
    trackApi.getAll.mockRejectedValue(new Error('Failed to fetch tracks'));

    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    // Wait for the component to update
    await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());

    // Since all APIs failed, no spotlight should be displayed
    await waitFor(() => {
      expect(screen.queryByText('Spotlight Artist')).not.toBeInTheDocument();
      expect(screen.queryByText('Spotlight Album')).not.toBeInTheDocument();
      expect(screen.queryByText('Spotlight Track')).not.toBeInTheDocument();
    });
  });

  test('renders correctly with no data available', async () => {
    artistApi.getAll.mockResolvedValue([]);
    albumApi.getAll.mockResolvedValue([]);
    trackApi.getAll.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <RandomSpotlight />
      </MemoryRouter>
    );

    // Wait for the component to update
    await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());

    // Since no data is available, no spotlight should be displayed
    await waitFor(() => {
      expect(screen.queryByText('Spotlight Artist')).not.toBeInTheDocument();
      expect(screen.queryByText('Spotlight Album')).not.toBeInTheDocument();
      expect(screen.queryByText('Spotlight Track')).not.toBeInTheDocument();
    });
  });
});
