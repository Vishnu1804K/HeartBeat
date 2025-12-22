import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data)
};

// Profile APIs
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data)
};

// Fitness Goals APIs
export const fitnessAPI = {
  getGoals: () => api.get('/fitness-goals'),
  setGoals: (data) => api.post('/fitness-goals', data),
  updateGoals: (data) => api.put('/fitness-goals', data),
  deleteGoals: () => api.delete('/fitness-goals')
};

// Activities APIs
export const activitiesAPI = {
  get: () => api.get('/activities'),
  log: (data) => api.post('/activities', data)
};

// Vital Signs APIs
export const vitalSignsAPI = {
  get: () => api.get('/vital-signs'),
  add: (data) => api.post('/vital-signs', data),
  delete: (id) => api.delete(`/vital-signs/${id}`)
};

// Recommendations API
export const recommendationsAPI = {
  get: () => api.get('/recommendations')
};

export default api;

