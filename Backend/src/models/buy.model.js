const mongoose = require('mongoose');

const buyFoodSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'food',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  price: Number,
  quantity: { type: Number, default: 1 },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED", "DELIVERED"],
    default: "PENDING"
  },

  paymentId: String,   // Razorpay / Stripe id
  orderId: String,

  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

const buyModel = mongoose.model('buy', buyFoodSchema);

module.exports = buyModel;