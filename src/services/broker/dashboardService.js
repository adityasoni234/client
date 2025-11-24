import api from './api';

const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/broker/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },

  // Get recent activity
  getActivity: async (params = {}) => {
    try {
      const response = await api.get('/broker/dashboard/activity', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activity' };
    }
  },

  // Get charts data
  getChartsData: async (period = '7d') => {
    try {
      const response = await api.get(`/broker/dashboard/charts?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch charts data' };
    }
  }
};

export default dashboardService;