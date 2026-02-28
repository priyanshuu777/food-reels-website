const mongoose = require('mongoose');
const { saveFood } = require('../controllers/food.controller');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video:{
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartner',//iska matlab hai ki ye field foodpartner model se reference lega
    },
    likeCount:{
        type: Number,
        default: 0
    },
    saveCount:{
        type: Number,
        default: 0
    }
});

const foodModel = mongoose.model('food', foodSchema);

module.exports = foodModel;