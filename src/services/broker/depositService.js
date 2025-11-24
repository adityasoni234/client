import api from './api';

const depositService = {
  // Get all deposits
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/broker/deposits', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deposits' };
    }
  },

  // Get deposit by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/broker/deposits/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deposit' };
    }
  },

  // Approve deposit
  approve: async (id, data = {}) => {
    try {
      const response = await api.post(`/broker/deposits/${id}/approve`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve deposit' };
    }
  },

  // Reject deposit
  reject: async (id, reason) => {
    try {
      const response = await api.post(`/broker/deposits/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject deposit' };
    }
  },

  // Get deposit stats
  getStats: async () => {
    try {
      const response = await api.get('/broker/deposits/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },

  // Export deposits
  exportCSV: async (params = {}) => {
    try {
      const response = await api.get('/broker/deposits/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export deposits' };
    }
  }
};

export default depositService;