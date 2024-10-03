import { Outlet, Route, Routes } from 'react-router-dom';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import MainLayout from '../MainLayout';

const CustomerPage = () => {
    return (
        <MainLayout>
            <Routes>
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customers/add" element={<CustomerForm />} />
                <Route path="/customers/:id" element={<CustomerForm />} />
            </Routes>
            <Outlet />
        </MainLayout>
    );
}
export default CustomerPage;
