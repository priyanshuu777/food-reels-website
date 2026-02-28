const express = require('express');
const router = express.Router();
const buyController = require('../controllers/buy.controller');
const authMiddleware = require('../middleware/auth.middleware');

// User creates a purchase (PENDING)
router.post('/', authMiddleware.authUserMiddleware, buyController.createBuy);

// User views own purchases
router.get('/', authMiddleware.authUserMiddleware, buyController.getUserBuys);

// Food partner views purchases of their foods
router.get('/partner', authMiddleware.authFoodPartnerMiddleware, buyController.getPartnerBuys);

// Update status (only partner of the food)
router.patch('/:id/status', authMiddleware.authFoodPartnerMiddleware, buyController.updateStatus);

// Get a specific purchase (user only)
router.get('/:id', authMiddleware.authUserMiddleware, buyController.getBuyById);

module.exports = router;