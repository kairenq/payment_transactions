import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 but DON'T auto-redirect
      // Let the component handle the redirect
      localStorage.removeItem('access_token');
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

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions/', { params }),
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
