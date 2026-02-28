const express = require("express");
const router = express.Router();

const { createPayment, xenditWebhook } = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create Xendit invoice
router.post("/create", authMiddleware.authUserMiddleware, createPayment);

// Xendit webhook (NO auth)
router.post("/webhook", xenditWebhook);

module.exports = router;
