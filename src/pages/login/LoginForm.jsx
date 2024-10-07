import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/entitiesApi'; // Import the authApi

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and registration
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For redirection

  // Hardcode role ID to 3 for admin users for testing purpose
  const roleId = 3;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const credentials = { email, password };
      let response;

      if (isRegister) {
        // Automatically assign roleId 1 during registration
        response = await authApi.register({ ...credentials, roleId }); // Register the user
        navigate('/'); // Redirect after registration
      } else {
        response = await authApi.login(credentials); // Login the user
        navigate('/'); // Redirect after login
      }

      localStorage.setItem('token', response.token); // Save JWT token in localStorage
      setMessage(isRegister ? 'Registration successful!' : 'Login successful!');
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div className="mt-3 text-center">
        <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
      {message && <p className="mt-3 text-center text-danger">{message}</p>}
    </div>
  );
};

export default LoginForm;
