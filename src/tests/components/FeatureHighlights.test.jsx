// src/tests/FeatureHighlights.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import FeatureHighlights from '../../components/FeatureHighlights';
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

describe('FeatureHighlights component', () => {
  const mockArtist = { id: 1, name: 'Test Artist' };
  const mockAlbum = { id: 1, title: 'Test Album', artist: 'Test Artist' };
  const mockTrack = { id: 1, name: 'Test Track', album: 'Test Album' };

  beforeEach(() => {
    artistApi.getAll.mockResolvedValue([mockArtist]);
    albumApi.getAll.mockResolvedValue([mockAlbum]);
    trackApi.getAll.mockResolvedValue([mockTrack]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially and then displays featured items', async () => {
    render(
      <MemoryRouter>
        <FeatureHighlights />
      </MemoryRouter>
    );

    // Initially, expect no featured content
    expect(screen.queryByText('Featured Artist')).not.toBeInTheDocument();
    expect(screen.queryByText('Featured Album')).not.toBeInTheDocument();
    expect(screen.queryByText('Featured Track')).not.toBeInTheDocument();

    // Wait for the featured content to be displayed
    await waitFor(() => expect(screen.getByText('Featured Artist')).toBeInTheDocument());
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Featured Album')).toBeInTheDocument();
    expect(screen.getByText('Test Album by Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Featured Track')).toBeInTheDocument();
    expect(screen.getByText('Test Track from Test Album')).toBeInTheDocument();
  });

  test('renders correctly with no featured items if API returns empty arrays', async () => {
    artistApi.getAll.mockResolvedValue([]);
    albumApi.getAll.mockResolvedValue([]);
    trackApi.getAll.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <FeatureHighlights />
      </MemoryRouter>
    );

    // Wait for the component to update
    await waitFor(() => {
      expect(screen.queryByText('Featured Artist')).not.toBeInTheDocument();
      expect(screen.queryByText('Featured Album')).not.toBeInTheDocument();
      expect(screen.queryByText('Featured Track')).not.toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    artistApi.getAll.mockRejectedValue(new Error('Failed to fetch artists'));
    albumApi.getAll.mockRejectedValue(new Error('Failed to fetch albums'));
    trackApi.getAll.mockRejectedValue(new Error('Failed to fetch tracks'));

    render(
      <MemoryRouter>
        <FeatureHighlights />
      </MemoryRouter>
    );

    // Expect no featured content to be rendered due to the error
    await waitFor(() => {
      expect(screen.queryByText('Featured Artist')).not.toBeInTheDocument();
      expect(screen.queryByText('Featured Album')).not.toBeInTheDocument();
      expect(screen.queryByText('Featured Track')).not.toBeInTheDocument();
    });
  });

  test('renders correct links for featured items', async () => {
    render(
      <MemoryRouter>
        <FeatureHighlights />
      </MemoryRouter>
    );

    // Wait for the featured content to be displayed
    await waitFor(() => {
      expect(screen.getByText('Featured Artist')).toBeInTheDocument();
      expect(screen.getByText('Featured Album')).toBeInTheDocument();
      expect(screen.getByText('Featured Track')).toBeInTheDocument();
    });

    // Check the links
    expect(screen.getByRole('link', { name: /view artist/i })).toHaveAttribute('href', '/artists/1');
    expect(screen.getByRole('link', { name: /view album/i })).toHaveAttribute('href', '/albums/1');
    expect(screen.getByRole('link', { name: /view track/i })).toHaveAttribute('href', '/tracks/1');
  });
});
