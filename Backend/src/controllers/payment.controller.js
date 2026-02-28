const axios = require("axios");
const buyModel = require("../models/buy.model");

// CREATE PAYMENT LINK (Xendit REST API)
async function createPayment(req, res) {
  try {
    const { buyId } = req.body;

    const buy = await buyModel.findById(buyId).populate("food");
    if (!buy) return res.status(404).json({ message: "Purchase not found" });
    if (String(buy.user) !== String(req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    const amount = Math.round(buy.price * buy.quantity);

    console.log({
  external_id: "order_" + buy._id,
  amount,
  payer_email: req.user.email,
  description: `Payment for ${buy.food.name}`,
  currency: "IDR"
});

    const response = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
    external_id: "order_" + buy._id,
    amount: amount,                  // number only
    payer_email: req.user.email,     // required
    description: `Payment for ${buy.food.name}`,
    currency: "IDR",                 // MUST be IDR
    success_redirect_url: "http://localhost:5173/success",
    failure_redirect_url: "http://localhost:5173/failed",
    metadata: {
      buyId: buy._id.toString()
    }
    
  },
  {
    auth: {
      username: process.env.XENDIT_SECRET_KEY,
      password: ""
    }
  }
  
    );

    const paymentLink = response.data;

    buy.orderId = paymentLink.id;
    await buy.save();

    res.json({
      success: true,
      paymentUrl: paymentLink.checkout_url
    });

  } catch (err) {
    console.error("Xendit REST error", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data || err.message });
  }
}

// WEBHOOK
async function xenditWebhook(req, res) {
  try {
    const data = req.body;

    if (data.status === "SUCCEEDED") {
      const buyId = data.metadata.buyId;

      await buyModel.findByIdAndUpdate(buyId, {
        status: "PAID",
        paymentId: data.id
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error", err);
    res.sendStatus(500);
  }
}

module.exports = { createPayment, xenditWebhook };
