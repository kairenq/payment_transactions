import axios from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('🔑 Sending request with token:', token ? 'Yes' : 'No');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Authorization header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      hasToken: !!localStorage.getItem('access_token')
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token on auth errors
      localStorage.removeItem('access_token');
      console.log('🗑️ Token cleared due to auth error');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats'),
};

// Helper: Remove empty/null/undefined parameters
const cleanParams = (params) => {
  if (!params) return {};
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // Include only non-empty values (skip '', null, undefined)
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions/', { params: cleanParams(params) }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions/', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getHistory: (id) => api.get(`/transactions/${id}/history`),

  // Категории
  getCategories: () => api.get('/transactions/categories'),
  createCategory: (data) => api.post('/transactions/categories', data),
  updateCategory: (id, data) => api.put(`/transactions/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/transactions/categories/${id}`),
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getMonthlyChart: (months) => api.get('/analytics/chart/monthly', { params: { months } }),
  getCategoryChart: (days) => api.get('/analytics/chart/category', { params: { days } }),
  getStatusChart: () => api.get('/analytics/chart/status'),
  getDailyChart: (days) => api.get('/analytics/chart/daily', { params: { days } }),
  getTopCategories: (limit, type) => api.get('/analytics/top-categories', { params: { limit, type } }),
  getRecentActivity: (limit) => api.get('/analytics/recent-activity', { params: { limit } }),
};

export default api;
