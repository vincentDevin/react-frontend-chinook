import { logout } from '../api/authUtils'; // Assuming this is your logout function
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear the token from storage
        navigate('/'); // Redirect the user to the login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
