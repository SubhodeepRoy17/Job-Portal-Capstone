import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;