import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import TrackList from './TrackList';
import TrackForm from './TrackForm';
import { useDocTitle } from '../../useDocTitle';

const TrackPage = () => {
    useDocTitle('Tracks - Music Database App');

    return (
        <MainLayout>
            <Routes>
                <Route index element={<TrackList />} />
                <Route path="add" element={<TrackForm />} />
                <Route path=":trackId" element={<TrackForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default TrackPage;
