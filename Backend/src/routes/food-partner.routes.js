const express = require('express');
const router = express.Router();
const foodPartnerController = require('../controllers/food-partner.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { getPartnerStats } = require('../controllers/Partner.controller');
//GET api/food-partner/:id ye food-partner ki profile dekhne ke liye
router.get('/:id', authMiddleware.authUserMiddleware,foodPartnerController.getFoodPartnerById)
router.get("/:partnerId/stats", getPartnerStats);

module.exports = router;