import api from './api';

// Profile related API calls
export const getProfile = () => api.get('/profile');

export const updateProfile = (data) => api.put('/profile', data);

export const updatePassword = (data) => api.put('/profile/password', data);

export const getProfileStats = () => api.get('/profile/stats');