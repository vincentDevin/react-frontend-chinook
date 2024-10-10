import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, albumApi, trackApi } from '../api/entitiesApi';

const FeatureHighlights = () => {
    const [featured, setFeatured] = useState({
        artist: null,
        album: null,
        track: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedItems = async () => {
            try {
                setLoading(true);

                // Fetch the total count for each type
                const [artistCount, albumCount, trackCount] = await Promise.all([
                    artistApi.getAll({ limit: 0 }), // Fetch count only
                    albumApi.getAll({ limit: 0 }), // Fetch count only
                    trackApi.getAll({ limit: 0 }), // Fetch count only
                ]);

                const artistTotal = artistCount.totalCount || 1;
                const albumTotal = albumCount.totalCount || 1;
                const trackTotal = trackCount.totalCount || 1;

                // Generate random offset values within the range
                const randomArtistOffset = Math.floor(Math.random() * artistTotal);
                const randomAlbumOffset = Math.floor(Math.random() * albumTotal);
                const randomTrackOffset = Math.floor(Math.random() * trackTotal);

                // Fetch a single item for each type using random offset
                const [artistResponse, albumResponse, trackResponse] = await Promise.all([
                    artistApi.getAll({ limit: 1, offset: randomArtistOffset }),
                    albumApi.getAll({ limit: 1, offset: randomAlbumOffset }),
                    trackApi.getAll({ limit: 1, offset: randomTrackOffset })
                ]);

                setFeatured({
                    artist: artistResponse.artists ? artistResponse.artists[0] : artistResponse[0] || null,
                    album: albumResponse.albums ? albumResponse.albums[0] : albumResponse[0] || null,
                    track: trackResponse.tracks ? trackResponse.tracks[0] : trackResponse[0] || null,
                });
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to fetch featured items.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedItems();
    }, []);

    if (loading) {
        return (
            <section className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container my-5 text-center text-danger">
                {error}
            </section>
        );
    }

    return (
        <section className="my-5 feature-highlights">
            <div className="row text-center">
                {featured.artist && (
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Random Artist</h5>
                                <p className="card-text">{featured.artist.Name}</p>
                                <Link
                                    to={`/artists/${featured.artist.ArtistId}`}
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
                                <h5 className="card-title">Random Album</h5>
                                <p className="card-text">
                                    {featured.album.Title}
                                    <br />
                                    {featured.album.ArtistName || 'Unknown Artist'}
                                </p>
                                <Link
                                    to={`/albums/${featured.album.AlbumId}`}
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
                                <h5 className="card-title">Random Track</h5>
                                <p className="card-text">
                                    {featured.track.Name}
                                    <br />
                                    {featured.track.AlbumTitle || 'Unknown Album'}
                                </p>
                                <Link
                                    to={`/tracks/${featured.track.TrackId}`}
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
