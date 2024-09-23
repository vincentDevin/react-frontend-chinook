import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Centralized base URL
});

export default api;
