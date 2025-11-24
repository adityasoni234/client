import api from './api';

const kycService = {
  // Get all KYC requests
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/broker/kyc', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch KYC requests' };
    }
  },

  // Get KYC by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/broker/kyc/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch KYC' };
    }
  },

  // Approve KYC
  approve: async (id, remarks = '') => {
    try {
      const response = await api.post(`/broker/kyc/${id}/approve`, { remarks });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve KYC' };
    }
  },

  // Reject KYC
  reject: async (id, reason) => {
    try {
      const response = await api.post(`/broker/kyc/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject KYC' };
    }
  },

  // Get KYC stats
  getStats: async () => {
    try {
      const response = await api.get('/broker/kyc/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },

  // Export KYC data
  exportCSV: async (params = {}) => {
    try {
      const response = await api.get('/broker/kyc/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export KYC data' };
    }
  }
};

export default kycService;