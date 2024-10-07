import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import ArtistList from './ArtistList';
import ArtistForm from './ArtistForm';
import ArtistView from './ArtistView';  // Import the ArtistView component
import { useDocTitle } from '../../hooks/useDocTitle';
import { getUserRoleFromToken } from '../../api/authUtils'; // Utility to get user role

const ArtistPage = () => {
    useDocTitle('Artists - Music Database App');

    // Get the user role from the token
    const userRoleId = getUserRoleFromToken();
    const isAdmin = userRoleId === 3; // Only role ID 3 is admin

    return (
        <MainLayout>
            <Routes>
                <Route index element={<ArtistList />} />
                
                {/* View artist details */}
                <Route path=":artistId/" element={<ArtistView />} /> {/* Add this */}

                {/* Only allow access to the form if the user is an admin */}
                {isAdmin && (
                    <>
                        <Route path="add" element={<ArtistForm />} />
                        <Route path=":artistId/edit" element={<ArtistForm />} /> {/* Rename to 'edit' for clarity */}
                    </>
                )}
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default ArtistPage;
