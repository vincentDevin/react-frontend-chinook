import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Function to get the base path
const getBasePath = (pathname) => pathname.split('/')[1] || '/';

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
    const location = useLocation();
    const basePath = getBasePath(location.pathname);
    
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
                    <AnimatePresence mode="wait">
                            <motion.main
                                key={basePath} // Use base path to trigger animation only on main route change
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {children}
                            </motion.main>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer Section with Animation */}
            <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <Footer />
            </motion.footer>
        </div>
    );
};

export default MainLayout;
