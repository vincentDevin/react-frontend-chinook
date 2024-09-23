import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/artists/ArtistPage';
import TrackPage from './pages/tracks/TrackPage';
import AlbumPage from './pages/albums/AlbumPage';
import GenrePage from './pages/genres/GenrePage';
import MediaTypePage from './pages/media-types/MediaTypePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artists/*" element={<ArtistPage />} />
            <Route path="/tracks/*" element={<TrackPage />} />
            <Route path="/albums/*" element={<AlbumPage />} />
            <Route path="/genres/*" element={<GenrePage />} />
            <Route path="/media-types/*" element={<MediaTypePage />} />
        </Routes>
    );
}

export default App;