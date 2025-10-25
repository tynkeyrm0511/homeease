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

// --- Residents API ---
export const getResidents = () => api.get('/resident').then(res => res.data);
export const getResidentById = (id) => api.get(`/resident/${id}`);
export const createResident = (residentData) => api.post('/resident', residentData);
export const deleteResident = (id) => api.delete(`/resident/${id}`);

// --- Invoice API ---
export const getInvoices = (params) => api.get('/invoice', { params }).then(res => res.data);
export const createInvoice = (invoiceData) => api.post('/invoice', invoiceData).then(res => res.data);
export const updateInvoice = (id, invoiceData) => api.put(`/invoice/${id}`, invoiceData).then(res => res.data);
export const deleteInvoice = (id) => api.delete(`/invoice/${id}`).then(res => res.data);
// Mock Payment API
export const createPaymentSession = (invoiceId) => api.post(`/invoice/${invoiceId}/create-payment`).then(res => res.data);
export const getInvoicePaymentStatus = (invoiceId) => api.get(`/invoice/${invoiceId}/payment-status`).then(res => res.data);
export const confirmMockPayment = (sessionId) => api.post(`/invoice/mock-pay/${sessionId}/confirm`).then(res => res.data);

// --- Request API ---
export const getRequests = (params) =>
  api.get('/request', { params }).then(res => {
    // Normalize to always return an array of requests for consumers
    const d = res.data;
    if (Array.isArray(d)) return d;
    if (d && Array.isArray(d.data)) return d.data;
    // Fallback: if server returned a single object, wrap it
    if (d && typeof d === 'object') return [d];
    return [];
  });
export const getRequestById = (id) => api.get(`/request/${id}`).then(res => res.data);
export const updateRequestStatus = (id, data) => api.put(`/request/${id}`, data).then(res => res.data);
export const cancelRequest = (id) => api.post(`/request/${id}/cancel`).then(res => res.data);
export const createRequest = (data) => api.post('/request', data).then(res => res.data);

// --- Notification API ---
export const getNotifications = () => api.get('/notification').then(res => res.data);
export const getNotificationById = (id) => api.get(`/notification/${id}`).then(res => res.data);
export const createNotification = (data) => api.post('/notification/add', data).then(res => res.data);
export const updateNotification = (id, data) => api.put(`/notification/${id}`, data).then(res => res.data);
export const deleteNotification = (id) => api.delete(`/notification/${id}`).then(res => res.data);

export default api;

