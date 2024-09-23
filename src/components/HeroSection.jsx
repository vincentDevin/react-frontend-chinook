import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="bg-dark text-white text-center py-5">
            <div className="container">
                <h1 className="display-4">Welcome to Music Database</h1>
                <p className="lead">Explore artists, albums, tracks, and more!</p>
                <Link to="/tracks" className="btn btn-primary btn-lg mt-3">
                    Get Started
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;
