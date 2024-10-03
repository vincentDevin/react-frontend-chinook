import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import ArtistList from './ArtistList';
import ArtistForm from './ArtistForm';
import { useDocTitle } from '../../hooks/useDocTitle';

const ArtistPage = () => {
    useDocTitle('Artists - Music Database App');

    return (
        <MainLayout>
            <Routes>
                <Route index element={<ArtistList />} />
                <Route path="add" element={<ArtistForm />} />
                <Route path=":artistId" element={<ArtistForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default ArtistPage;
