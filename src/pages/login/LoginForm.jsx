import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/entitiesApi'; // Import the authApi

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and registration
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For redirection

  // Hardcode role ID to 1 for regular users
  const roleId = 3; // Regular users get role ID 1

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
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <div>
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
