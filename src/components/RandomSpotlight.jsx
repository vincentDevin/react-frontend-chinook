import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, albumApi, trackApi } from '../api/entitiesApi';

const RandomSpotlight = () => {
    const [spotlight, setSpotlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomItem = async () => {
            try {
                setLoading(true);
                
                // Fetch random items for artist, album, and track
                const [randomArtist, randomAlbum, randomTrack] = await Promise.all([
                    artistApi.getRandom(),
                    albumApi.getRandom(),
                    trackApi.getRandom()
                ]);
    
                // Collect the items into an array with types
                const allItems = [
                    randomArtist && { type: 'artist', data: randomArtist },
                    randomAlbum && { type: 'album', data: randomAlbum },
                    randomTrack && { type: 'track', data: randomTrack }
                ].filter(Boolean); // Remove any null entries
    
                if (allItems.length === 0) {
                    setError('No spotlight items available.');
                    return;
                }
    
                // Randomly select one item from the list
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                setSpotlight(randomItem);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to fetch spotlight items.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchRandomItem();
    }, []);    

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-5 text-danger">
                {error}
            </div>
        );
    }

    const renderSpotlight = () => {
        if (!spotlight) return null; // Safety check if no spotlight item is selected

        switch (spotlight.type) {
            case 'artist':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Artist: {spotlight.data.Name}</h5>
                            <Link to={`/artists/${spotlight.data.ArtistId}`} className="btn btn-primary">
                                View Artist
                            </Link>
                        </div>
                    </div>
                );
            case 'album':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Album: {spotlight.data.Title}</h5>
                            <p className="card-text">By: {spotlight.data.ArtistName || 'Unknown Artist'}</p>
                            <Link to={`/albums/${spotlight.data.AlbumId}`} className="btn btn-primary">
                                View Album
                            </Link>
                        </div>
                    </div>
                );
            case 'track':
                return (
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Spotlight Track: {spotlight.data.Name}</h5>
                            <p className="card-text">Album: {spotlight.data.AlbumTitle || 'Unknown Album'}</p>
                            <Link to={`/tracks/${spotlight.data.TrackId}`} className="btn btn-primary">
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
