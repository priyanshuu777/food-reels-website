const buyModel = require('../models/buy.model');
const foodModel = require('../models/food.model');

async function createBuy(req, res) {
  try {
    const { foodId, quantity = 1, price } = req.body;
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const buy = await buyModel.create({
      food: food._id,
      user: req.user._id,
      price: price ?? food.price,
      quantity,
      status: 'PENDING'
    });

    return res.status(201).json({ success: true, buy });
  } catch (err) {
    console.error('createBuy error', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function getUserBuys(req, res) {
  try {
    const buys = await buyModel
      .find({ user: req.user._id })
      .populate('food')
      .sort({ purchaseDate: -1 });

    return res.json({ success: true, buys });
  } catch (err) {
    console.error('getUserBuys error', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function getBuyById(req, res) {
  try {
    const { id } = req.params;
    const buy = await buyModel.findById(id).populate('food user');
    if (!buy) return res.status(404).json({ message: 'Purchase not found' });

    // allow owner user or food partner who owns the food to view
    if (String(buy.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this purchase' });
    }

    return res.json({ success: true, buy });
  } catch (err) {
    console.error('getBuyById error', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function getPartnerBuys(req, res) {
  try {
    // find buys whose food belongs to the authenticated food partner
    const buys = await buyModel
      .find()
      .populate({ path: 'food' })
      .populate('user');

    const partnerBuys = buys.filter(b => b.food && String(b.food.foodPartner) === String(req.foodPartner._id));

    return res.json({ success: true, buys: partnerBuys });
  } catch (err) {
    console.error('getPartnerBuys error', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected values: PENDING, PAID, FAILED, DELIVERED

    const buy = await buyModel.findById(id).populate('food');
    if (!buy) return res.status(404).json({ message: 'Purchase not found' });

    // only the partner who owns the food can update status here
    if (String(buy.food.foodPartner) !== String(req.foodPartner._id)) {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    if (!['PENDING', 'PAID', 'FAILED', 'DELIVERED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    buy.status = status;
    await buy.save();

    return res.json({ success: true, buy });
  } catch (err) {
    console.error('updateStatus error', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  createBuy,
  getUserBuys,
  getBuyById,
  getPartnerBuys,
  updateStatus
};
