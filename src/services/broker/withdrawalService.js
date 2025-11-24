import api from './api';

const withdrawalService = {
  // Get all withdrawals
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/broker/withdrawals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch withdrawals' };
    }
  },

  // Get withdrawal by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/broker/withdrawals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch withdrawal' };
    }
  },

  // Approve withdrawal
  approve: async (id, data) => {
    try {
      const response = await api.post(`/broker/withdrawals/${id}/approve`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve withdrawal' };
    }
  },

  // Reject withdrawal
  reject: async (id, reason) => {
    try {
      const response = await api.post(`/broker/withdrawals/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject withdrawal' };
    }
  },

  // Get withdrawal stats
  getStats: async () => {
    try {
      const response = await api.get('/broker/withdrawals/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },

  // Export withdrawals
  exportCSV: async (params = {}) => {
    try {
      const response = await api.get('/broker/withdrawals/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export withdrawals' };
    }
  }
};

export default withdrawalService;