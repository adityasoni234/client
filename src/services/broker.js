import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with broker prefix
const api = axios.create({
  baseURL: `${API_URL}/broker`,  // Added /broker here!
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('brokerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('brokerToken', response.data.token);
      localStorage.setItem('brokerUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('brokerToken');
    localStorage.removeItem('brokerUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('brokerUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('brokerToken');
  }
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

// Client Services
export const clientService = {
  getAll: async (params) => {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  }
};

// Deposit Services
export const depositService = {
  getAll: async (params) => {
    const response = await api.get('/deposits', { params });
    return response.data;
  },

  approve: async (id) => {
    const response = await api.patch(`/deposits/${id}/approve`);
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await api.patch(`/deposits/${id}/reject`, { reason });
    return response.data;
  }
};

// Withdrawal Services
export const withdrawalService = {
  getAll: async (params) => {
    const response = await api.get('/withdrawals', { params });
    return response.data;
  },

  approve: async (id, utrNumber) => {
    const response = await api.patch(`/withdrawals/${id}/approve`, { utrNumber });
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await api.patch(`/withdrawals/${id}/reject`, { reason });
    return response.data;
  }
};

// KYC Services
export const kycService = {
  getAll: async (params) => {
    const response = await api.get('/kyc', { params });
    return response.data;
  },

  approve: async (id) => {
    const response = await api.patch(`/kyc/${id}/approve`);
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await api.patch(`/kyc/${id}/reject`, { reason });
    return response.data;
  }
};

export default api;
