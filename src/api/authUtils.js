// src/utils/authUtils.js

import { jwtDecode } from 'jwt-decode'; // This imports a named export

// Function to get user role from JWT token
export const getUserRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token); // Decode the token to get payload
    return decodedToken.roleId; // Assuming 'roleId' is stored in the token
  }
  return null; // Return null if no token or no role
};

export const logout = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    // Optionally redirect to the login page or another page
};
