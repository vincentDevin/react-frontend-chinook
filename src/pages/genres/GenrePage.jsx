import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import GenreList from './GenreList';
import GenreForm from './GenreForm';
import { useDocTitle } from '../../useDocTitle';

const GenrePage = () => {
    useDocTitle('Genres - Music Database App');
    return (
        <MainLayout>
            <Routes>
                <Route index element={<GenreList />} />
                <Route path="add" element={<GenreForm />} />
                <Route path=":genreId" element={<GenreForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default GenrePage;
