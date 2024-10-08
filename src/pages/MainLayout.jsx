import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
//import { motion, AnimatePresence } from 'framer-motion';
//import { useLocation } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
    //const location = useLocation();
    
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header Section */}
            <Header />

            {/* Navbar Section */}
            <NavBar />

            {/* Main Content Section with Animation */}
            <div className="container my-4 flex-grow-1">
                <div className="row">
                    <div className="col">
                        {children}
                    </div>
                </div>
            </div>

            {/* Static Footer (no animation) */}
            <Footer />
        </div>
    );
};

export default MainLayout;
