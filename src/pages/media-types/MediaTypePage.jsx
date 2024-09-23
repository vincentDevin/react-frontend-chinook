import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import MediaTypeList from './MediaTypeList';
import MediaTypeForm from './MediaTypeForm';
import { useDocTitle } from '../../useDocTitle';

const MediaTypePage = () => {
    useDocTitle('Media Types - Music Database App');

    return (
        <MainLayout>
            <Routes>
                <Route index element={<MediaTypeList />} />
                <Route path="add" element={<MediaTypeForm />} />
                <Route path=":mediaTypeId" element={<MediaTypeForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
};

export default MediaTypePage;
