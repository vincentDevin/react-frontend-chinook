// src/tests/App.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import '@testing-library/jest-dom'; // for custom matchers like toBeInTheDocument
import { vi } from 'vitest'; // Import Vitest's mock function

// Mock the components used in the App component for simplicity
vi.mock('../pages/HomePage', () => {
  const HomePage = () => <div>Home Page</div>;
  HomePage.displayName = 'HomePage'; // Add displayName
  return { default: HomePage };
});

vi.mock('../pages/artists/ArtistPage', () => {
  const ArtistPage = () => <div>Artist Page</div>;
  ArtistPage.displayName = 'ArtistPage'; // Add displayName
  return { default: ArtistPage };
});

vi.mock('../pages/tracks/TrackPage', () => {
  const TrackPage = () => <div>Track Page</div>;
  TrackPage.displayName = 'TrackPage'; // Add displayName
  return { default: TrackPage };
});

vi.mock('../pages/albums/AlbumPage', () => {
  const AlbumPage = () => <div>Album Page</div>;
  AlbumPage.displayName = 'AlbumPage'; // Add displayName
  return { default: AlbumPage };
});

vi.mock('../pages/genres/GenrePage', () => {
  const GenrePage = () => <div>Genre Page</div>;
  GenrePage.displayName = 'GenrePage'; // Add displayName
  return { default: GenrePage };
});

vi.mock('../pages/media-types/MediaTypePage', () => {
  const MediaTypePage = () => <div>Media Type Page</div>;
  MediaTypePage.displayName = 'MediaTypePage'; // Add displayName
  return { default: MediaTypePage };
});

describe('App component routing', () => {
  test('renders HomePage component when on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check if HomePage is rendered
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders ArtistPage component when on /artists path', () => {
    render(
      <MemoryRouter initialEntries={['/artists']}>
        <App />
      </MemoryRouter>
    );

    // Check if ArtistPage is rendered
    expect(screen.getByText('Artist Page')).toBeInTheDocument();
  });

  test('renders TrackPage component when on /tracks path', () => {
    render(
      <MemoryRouter initialEntries={['/tracks']}>
        <App />
      </MemoryRouter>
    );

    // Check if TrackPage is rendered
    expect(screen.getByText('Track Page')).toBeInTheDocument();
  });

  test('renders AlbumPage component when on /albums path', () => {
    render(
      <MemoryRouter initialEntries={['/albums']}>
        <App />
      </MemoryRouter>
    );

    // Check if AlbumPage is rendered
    expect(screen.getByText('Album Page')).toBeInTheDocument();
  });

  test('renders GenrePage component when on /genres path', () => {
    render(
      <MemoryRouter initialEntries={['/genres']}>
        <App />
      </MemoryRouter>
    );

    // Check if GenrePage is rendered
    expect(screen.getByText('Genre Page')).toBeInTheDocument();
  });

  test('renders MediaTypePage component when on /media-types path', () => {
    render(
      <MemoryRouter initialEntries={['/media-types']}>
        <App />
      </MemoryRouter>
    );

    // Check if MediaTypePage is rendered
    expect(screen.getByText('Media Type Page')).toBeInTheDocument();
  });
});
