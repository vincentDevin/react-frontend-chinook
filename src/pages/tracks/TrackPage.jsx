import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import TrackList from './TrackList';
import TrackForm from './TrackForm';
import TrackView from './TrackView'; // Import the TrackView component
import { useDocTitle } from '../../hooks/useDocTitle';
import { getUserRoleFromToken } from '../../api/authUtils'; // Utility to get user role

const TrackPage = () => {
    useDocTitle('Tracks - Music Database App');

    // Get the user role from the token
    const userRoleId = getUserRoleFromToken();
    const isAdmin = userRoleId === 3; // Only role ID 3 is admin

    return (
        <MainLayout>
            <Routes>
                <Route index element={<TrackList />} />

                {/* If the user is an admin, they can add/edit tracks */}
                {isAdmin && (
                    <>
                        <Route path="add" element={<TrackForm />} />
                        <Route path=":trackId/edit" element={<TrackForm />} />
                    </>
                )}

                {/* For both admin and non-admin, show the track details using TrackView */}
                <Route path=":trackId" element={<TrackView />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default TrackPage;
