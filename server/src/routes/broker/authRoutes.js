const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../../controllers/broker/authController');
const { authenticate } = require('../../middleware/auth');

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  authController.login
);

// Verify token
router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;
