const express = require('express');
const router = express.Router();
const withdrawalController = require('../../controllers/broker/withdrawalController');
const { authenticate } = require('../../middleware/auth');

// Get all withdrawals
router.get('/', authenticate, withdrawalController.getAllWithdrawals);

// Approve withdrawal
router.patch('/:id/approve', authenticate, withdrawalController.approveWithdrawal);

// Reject withdrawal
router.patch('/:id/reject', authenticate, withdrawalController.rejectWithdrawal);

module.exports = router;
