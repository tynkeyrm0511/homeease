// src/services/api.js
import axios from 'axios';

// Sử dụng import.meta.env thay vì process.env (Vite way)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('API Base URL:', API_BASE_URL); // Debug

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, redirect về login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Residents API
export const getResidents = () => {
  return api.get('/resident');
};

export const getResidentById = (id) => {
  return api.get(`/resident/${id}`);
};


// Thêm cư dân mới
export const createResident = (residentData) => {
  return api.post('/resident', residentData);
};

// Xóa cư dân
export const deleteResident = (id) => {
  return api.delete(`/resident/${id}`);
};

// Invoice API
export const getInvoices = () => {
  return api.get('/invoice').then(res => res.data);
};

export default api;