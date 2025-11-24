const express = require('express');
const router = express.Router();
const depositController = require('../../controllers/broker/depositController');
const { authenticate } = require('../../middleware/auth');

// Get all deposits
router.get('/', authenticate, depositController.getAllDeposits);

// Approve deposit
router.patch('/:id/approve', authenticate, depositController.approveDeposit);

// Reject deposit
router.patch('/:id/reject', authenticate, depositController.rejectDeposit);

module.exports = router;
