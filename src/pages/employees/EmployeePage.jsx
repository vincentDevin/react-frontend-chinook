import { Outlet, Route, Routes } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import MainLayout from '../MainLayout';

const EmployeePage = () => (

    <MainLayout>
        <Routes>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeForm />} />
        </Routes>
        <Outlet />
    </MainLayout>
);

export default EmployeePage;
