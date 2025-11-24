const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/broker/clientController');
const { authenticate } = require('../../middleware/auth');

// Get all clients
router.get('/', authenticate, clientController.getAllClients);

// Get client by ID
router.get('/:id', authenticate, clientController.getClientById);

module.exports = router;
