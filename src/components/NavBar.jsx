import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../api/authUtils'; // Import the logout function

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token exists in localStorage to determine if the user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // If token exists, user is logged in
    }, []);

    const handleLogout = () => {
        logout(); // Clear the token from localStorage
        setIsLoggedIn(false); // Update the state to reflect the user is logged out
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light-bg" role="navigation">
            <div className="container">
                <NavLink className="navbar-brand" to="/" aria-label="Music Database Home">
                    Music Database App
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/tracks">
                                Tracks
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/artists">
                                Artists
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/albums">
                                Albums
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/genres">
                                Genres
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/media-types">
                                Media Types
                            </NavLink>
                        </li>
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login">
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
