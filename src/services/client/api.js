import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/client';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clientToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('clientToken', response.data.token);
      localStorage.setItem('clientUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('clientUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('clientToken');
  }
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getAccountInfo: async () => {
    const response = await api.get('/dashboard/account');
    return response.data;
  },

  getOpenPositions: async () => {
    const response = await api.get('/dashboard/positions');
    return response.data;
  },

  getRecentTransactions: async () => {
    const response = await api.get('/dashboard/transactions/recent');
    return response.data;
  }
};

// Deposit Services
export const depositService = {
  create: async (formData) => {
    const response = await api.post('/deposits/request', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/deposits/history');
    return response.data;
  }
};

// Withdrawal Services
export const withdrawalService = {
  create: async (withdrawalData) => {
    const response = await api.post('/withdrawals/request', withdrawalData);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/withdrawals/history');
    return response.data;
  }
};

export default api;
