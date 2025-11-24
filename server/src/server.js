require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Broker Admin Routes
const brokerAuthRoutes = require('./routes/broker/authRoutes');
const brokerDashboardRoutes = require('./routes/broker/dashboardRoutes');
const brokerClientRoutes = require('./routes/broker/clientRoutes');
const brokerDepositRoutes = require('./routes/broker/depositRoutes');
const brokerWithdrawalRoutes = require('./routes/broker/withdrawalRoutes');
const brokerKYCRoutes = require('./routes/broker/kycRoutes');

app.use('/api/broker/auth', brokerAuthRoutes);
app.use('/api/broker/dashboard', brokerDashboardRoutes);
app.use('/api/broker/clients', brokerClientRoutes);
app.use('/api/broker/deposits', brokerDepositRoutes);
app.use('/api/broker/withdrawals', brokerWithdrawalRoutes);
app.use('/api/broker/kyc', brokerKYCRoutes);

// Client Portal Routes
const clientAuthRoutes = require('./routes/client/authRoutes');
const clientDashboardRoutes = require('./routes/client/dashboardRoutes');
const clientDepositRoutes = require('./routes/client/depositRoutes');
const clientWithdrawalRoutes = require('./routes/client/withdrawalRoutes');

app.use('/api/client/auth', clientAuthRoutes);
app.use('/api/client/dashboard', clientDashboardRoutes);
app.use('/api/client/deposits', clientDepositRoutes);
app.use('/api/client/withdrawals', clientWithdrawalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Broker Admin API: http://localhost:${PORT}/api/broker`);
  console.log(`👤 Client Portal API: http://localhost:${PORT}/api/client`);
});

module.exports = app;
