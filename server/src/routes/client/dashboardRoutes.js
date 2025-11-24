const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/client/dashboardController');
const { authenticate } = require('../../middleware/auth');

// Get dashboard data
router.get('/stats', authenticate, dashboardController.getDashboardStats);

// Get account info
router.get('/account', authenticate, dashboardController.getAccountInfo);

// Get open positions
router.get('/positions', authenticate, dashboardController.getOpenPositions);

// Get recent transactions
router.get('/transactions/recent', authenticate, dashboardController.getRecentTransactions);

module.exports = router;
