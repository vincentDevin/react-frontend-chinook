import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { useDocTitle } from '../../hooks/useDocTitle';
import LoginForm from './LoginForm';

const LoginPage = () => {
  useDocTitle('Login - Music Database App');

  return (
    <MainLayout>
      <Routes>
        {/* Route for the login form */}
        <Route path="/" element={<LoginForm />} />

        {/* Optional: You can add other sub-routes here if needed */}
      </Routes>
      <Outlet />
    </MainLayout>
  );
};

export default LoginPage;
