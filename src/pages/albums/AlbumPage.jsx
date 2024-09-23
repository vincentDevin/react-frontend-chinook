import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import AlbumList from './AlbumList';
import AlbumForm from './AlbumForm';
import { useDocTitle } from '../../useDocTitle';

const AlbumPage = () => {
    useDocTitle('Albums - Music Database App');

    return (
        <MainLayout>
            <Routes>
                <Route index element={<AlbumList />} />
                <Route path="add" element={<AlbumForm />} />
                <Route path=":albumId" element={<AlbumForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default AlbumPage;
