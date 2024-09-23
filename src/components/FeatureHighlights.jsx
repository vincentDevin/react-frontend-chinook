import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, albumApi, trackApi } from '../api/entitiesApi';

const FeatureHighlights = () => {
    const [featured, setFeatured] = useState({
        artist: null,
        album: null,
        track: null,
    });

    useEffect(() => {
        // Fetch a single item for each type dynamically
        Promise.all([artistApi.getAll(), albumApi.getAll(), trackApi.getAll()])
            .then(([artists, albums, tracks]) => {
                setFeatured({
                    artist: artists[0] || null, // Choose the first artist
                    album: albums[0] || null, // Choose the first album
                    track: tracks[0] || null, // Choose the first track
                });
            })
            .catch((err) => console.error('Failed to fetch data:', err));
    }, []);

    return (
        <section className="container my-5">
            <div className="row text-center">
                {featured.artist && (
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Featured Artist</h5>
                                <p className="card-text">{featured.artist.name}</p>
                                <Link
                                    to={`/artists/${featured.artist.id}`}
                                    className="btn btn-primary"
                                >
                                    View Artist
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {featured.album && (
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Featured Album</h5>
                                <p className="card-text">
                                    {featured.album.title} by {featured.album.artist}
                                </p>
                                <Link
                                    to={`/albums/${featured.album.id}`}
                                    className="btn btn-primary"
                                >
                                    View Album
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {featured.track && (
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Featured Track</h5>
                                <p className="card-text">
                                    {featured.track.name} from {featured.track.album}
                                </p>
                                <Link
                                    to={`/tracks/${featured.track.id}`}
                                    className="btn btn-primary"
                                >
                                    View Track
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeatureHighlights;
