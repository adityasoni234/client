const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../../controllers/client/authController');

// Client login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  authController.login
);

// Client register
router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').notEmpty(),
  authController.register
);

module.exports = router;
