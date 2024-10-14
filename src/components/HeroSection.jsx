import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="hero-section text-center py-5">
            <div className="container">
                <h1 className="hero-title display-4">Welcome to Music Database</h1>
                <p className="hero-subtitle lead">Explore artists, albums, tracks, and more!</p>
                <Link to="/tracks" className="btn btn-primary btn-lg mt-3 hero-btn">
                    Get Started
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;
