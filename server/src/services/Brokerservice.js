// Broker Dashboard Service
// Path: client/src/services/broker.js (or brokerService.js)

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or wherever you store your auth token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dashboard service
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/broker/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get client statistics (if you add this endpoint later)
  getClientStats: async () => {
    try {
      const response = await api.get('/broker/dashboard/client-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching client stats:', error);
      throw error;
    }
  },

  // Get financial statistics (if you add this endpoint later)
  getFinancialStats: async () => {
    try {
      const response = await api.get('/broker/dashboard/financial-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      throw error;
    }
  }
};

export default dashboardService;