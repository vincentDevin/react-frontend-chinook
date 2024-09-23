import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, albumApi, trackApi } from '../api/entitiesApi'; // Import APIs

const RandomSpotlight = () => {
    const [spotlight, setSpotlight] = useState(null);

    useEffect(() => {
        // Fetch data from all APIs
        Promise.all([artistApi.getAll(), albumApi.getAll(), trackApi.getAll()])
            .then(([artists, albums, tracks]) => {
                const allItems = [
                    ...artists.map((artist) => ({
                        type: 'artist',
                        data: artist,
                    })),
                    ...albums.map((album) => ({ type: 'album', data: album })),
                    ...tracks.map((track) => ({ type: 'track', data: track })),
                ];
                // Pick a random item from the combined list
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                setSpotlight(randomItem);
            })
            .catch((err) => console.error('Failed to fetch data:', err));
    }, []);

    if (!spotlight) return <div className="text-center">Loading...</div>;

    const renderSpotlight = () => {
        switch (spotlight.type) {
            case 'artist':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Artist: {spotlight.data.name}</h5>
                            <p className="card-text">Genre: {spotlight.data.genre}</p>
                            <Link to={`/artists/${spotlight.data.id}`} className="btn btn-primary">
                                View Artist
                            </Link>
                        </div>
                    </div>
                );
            case 'album':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Album: {spotlight.data.title}</h5>
                            <p className="card-text">By: {spotlight.data.artist}</p>
                            <Link to={`/albums/${spotlight.data.id}`} className="btn btn-primary">
                                View Album
                            </Link>
                        </div>
                    </div>
                );
            case 'track':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Track: {spotlight.data.name}</h5>
                            <p className="card-text">Album: {spotlight.data.album}</p>
                            <Link to={`/tracks/${spotlight.data.id}`} className="btn btn-primary">
                                View Track
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="bg-light py-5">
            <div className="container">
                <h2 className="text-center mb-4">Random Spotlight</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">{renderSpotlight()}</div>
                </div>
            </div>
        </section>
    );
};

export default RandomSpotlight;
