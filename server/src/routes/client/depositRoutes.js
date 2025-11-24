const express = require('express');
const router = express.Router();
const multer = require('multer');
const depositController = require('../../controllers/client/depositController');
const { authenticate } = require('../../middleware/auth');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create deposit request
router.post('/request', 
  authenticate,
  upload.single('proof'),
  depositController.createDepositRequest
);

// Get deposit history
router.get('/history', authenticate, depositController.getDepositHistory);

module.exports = router;
