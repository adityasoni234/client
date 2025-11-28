// Dashboard Routes for Broker Admin
// Path: server/routes/broker/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getStats } = require('../../controllers/broker/dashboardController');
const { authenticateToken, requireBrokerAdmin } = require('../../middleware/auth');

// Protect all dashboard routes with authentication and broker admin check
router.use(authenticateToken);
router.use(requireBrokerAdmin);

// GET /api/broker/dashboard/stats
router.get('/stats', getStats);

module.exports = router;