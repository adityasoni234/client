const express = require('express');
const router = express.Router();
const withdrawalController = require('../../controllers/client/withdrawalController');
const { authenticate } = require('../../middleware/auth');

// Create withdrawal request
router.post('/request', authenticate, withdrawalController.createWithdrawalRequest);

// Get withdrawal history
router.get('/history', authenticate, withdrawalController.getWithdrawalHistory);

module.exports = router;
