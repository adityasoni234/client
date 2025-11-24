import api from './api';

const clientService = {
  // Get all clients
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/broker/clients', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch clients' };
    }
  },

  // Get client by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/broker/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch client' };
    }
  },

  // Create new client
  create: async (clientData) => {
    try {
      const response = await api.post('/broker/clients', clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create client' };
    }
  },

  // Update client
  update: async (id, clientData) => {
    try {
      const response = await api.put(`/broker/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update client' };
    }
  },

  // Block client
  block: async (id, reason) => {
    try {
      const response = await api.post(`/broker/clients/${id}/block`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to block client' };
    }
  },

  // Unblock client
  unblock: async (id) => {
    try {
      const response = await api.post(`/broker/clients/${id}/unblock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unblock client' };
    }
  },

  // Update client status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/broker/clients/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  // Export clients
  exportCSV: async (params = {}) => {
    try {
      const response = await api.get('/broker/clients/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export clients' };
    }
  }
};

export default clientService;