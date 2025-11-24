const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/broker/dashboardController');
const { authenticate } = require('../../middleware/auth');

// Get dashboard stats
router.get('/stats', authenticate, dashboardController.getStats);

module.exports = router;
