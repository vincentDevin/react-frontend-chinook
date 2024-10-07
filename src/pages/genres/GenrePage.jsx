import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import GenreList from './GenreList';
import GenreForm from './GenreForm';
import GenreTracksView from './GenreTracksView'; // Import the GenreTracksView component
import { useDocTitle } from '../../hooks/useDocTitle';

const GenrePage = () => {
    useDocTitle('Genres - Music Database App');
    
    return (
        <MainLayout>
            <Routes>
                <Route index element={<GenreList />} /> 
                
                {/* Route to add or edit a genre */}
                <Route path="add" element={<GenreForm />} />
                <Route path=":genreId" element={<GenreForm />} />
                
                {/* Route to view all tracks associated with a specific genre */}
                <Route path=":genreId/tracks" element={<GenreTracksView />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default GenrePage;
