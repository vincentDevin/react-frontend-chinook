import PropTypes from 'prop-types';
import Header from "../components/Header.jsx";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            <NavBar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
