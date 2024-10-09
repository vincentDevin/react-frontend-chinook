import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="mt-auto py-3 footer">
            <div className="container">
                <div className="row">
                    {/* About Us Section */}
                    <div className="col-md-4 mb-4">
                        <h5>About Us</h5>
                        <p>
                            We are a music database application providing information about various
                            artists, albums, and tracks. Stay tuned for updates and more features!
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="col-md-4 mb-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/" className="text-white text-decoration-none">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/artists" className="text-white text-decoration-none">
                                    Artists
                                </Link>
                            </li>
                            <li>
                                <Link to="/albums" className="text-white text-decoration-none">
                                    Albums
                                </Link>
                            </li>
                            <li>
                                <Link to="/genres" className="text-white text-decoration-none">
                                    Genres
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div className="col-md-4 mb-4">
                        <h5>Contact Us</h5>
                        <p>
                            Email:{' '}
                            <a href="mailto:info@musicapp.com" className="text-white">
                                info@musicapp.com
                            </a>
                        </p>
                        <p>Phone: +123 456 7890</p>
                        <h5>Follow Us</h5>
                        <div>
                            <Link to="#" className="text-white me-3">
                                <i className="bi bi-facebook"></i>
                            </Link>
                            <Link to="#" className="text-white me-3">
                                <i className="bi bi-twitter"></i>
                            </Link>
                            <Link to="#" className="text-white">
                                <i className="bi bi-instagram"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Section */}
                <div className="text-center mt-4">
                    <p className="mb-0">&copy; 2024 MusicApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
