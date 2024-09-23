import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { genreApi } from '../../api/entitiesApi';

const GenreList = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        genreApi.getAll().then((genres) => setGenres(genres));
    }, []);

    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 id="genreListHeading">Genres</h2>
                <Link to="/genres/add">
                    <button className="btn btn-primary" aria-label="Add a new genre">
                        Add Genre
                    </button>
                </Link>
            </div>
            <table className="table table-striped table-hover" aria-labelledby="genreListHeading">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Genre</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {genres.length > 0 ? (
                        genres.map((genre) => (
                            <tr key={genre.id}>
                                <td>{genre.name}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => navigate('/genres/' + genre.id)}
                                        aria-label={`Edit genre ${genre.name}`}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center">
                                No genres available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GenreList;
