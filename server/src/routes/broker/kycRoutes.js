const express = require('express');
const router = express.Router();
const kycController = require('../../controllers/broker/kycController');
const { authenticate } = require('../../middleware/auth');

// Get all KYC requests
router.get('/', authenticate, kycController.getAllKYC);

// Approve KYC
router.patch('/:id/approve', authenticate, kycController.approveKYC);

// Reject KYC
router.patch('/:id/reject', authenticate, kycController.rejectKYC);

module.exports = router;
