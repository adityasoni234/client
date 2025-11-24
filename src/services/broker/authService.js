import api from './api';

const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/broker/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('brokerToken', response.data.data.token);
        localStorage.setItem('brokerUser', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/broker/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('brokerToken');
    localStorage.removeItem('brokerUser');
    window.location.href = '/broker-admin/login';
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('brokerToken');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('brokerUser');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;