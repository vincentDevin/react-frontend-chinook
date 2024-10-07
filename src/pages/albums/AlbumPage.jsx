import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import AlbumList from './AlbumList';
import AlbumForm from './AlbumForm';
import AlbumView from './AlbumView'; // Import the new AlbumView component
import { useDocTitle } from '../../hooks/useDocTitle';
import { getUserRoleFromToken } from '../../api/authUtils'; // Utility to get user role

const AlbumPage = () => {
    useDocTitle('Albums - Music Database App');

    // Get the user role from the token
    const userRoleId = getUserRoleFromToken();
    const isAdmin = userRoleId === 3; // Only role ID 3 is admin

    return (
        <MainLayout>
            <Routes>
                <Route index element={<AlbumList />} />

                {/* More specific routes should be placed before generic ones */}
                {isAdmin && (
                    <>
                        <Route path="add" element={<AlbumForm />} />
                        <Route path=":albumId/edit" element={<AlbumForm />} /> {/* More specific route */}
                    </>
                )}

                {/* Generic route for viewing the album */}
                <Route path=":albumId" element={<AlbumView />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default AlbumPage;
