// src/api.js or src/api.ts

import axios from 'axios';

// Create an Axios instance with base URL and default settings
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Use environment variable for baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ensure token is fresh
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server-side error
      if (error.response.status === 401) {
        // Handle unauthorized access - possibly log out the user or redirect to login
        console.error('Unauthorized, please log in again.');
        // Implement logout or redirection logic here if needed
      } else {
        console.error(`API Error [${error.response.status}]:`, error.response.data.message || error.response.data);
      }
    } else if (error.request) {
      // Network or client-side error
      console.error('Network error or no response from server:', error.request);
    } else {
      // Unexpected errors
      console.error('Unexpected error:', error.message);
    }
    return Promise.reject(error); // Always reject to propagate the error
  }
);

export default api;
