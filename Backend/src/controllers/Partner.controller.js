const Food = require("../models/food.model");
const Buy = require("../models/buy.model");

exports.getPartnerStats = async (req, res) => {
  try {
    const { partnerId } = req.params;

    // 🥗 total meals = menu size
    const totalMeals = await Food.countDocuments({
      foodPartner: partnerId
    });

    // 👥 customers served = unique PAID buyers
    const customersServed = await Buy.distinct("user", {
      status: "PAID"
    });

    res.json({
      totalMeals,
      customersServed: customersServed.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get stats" });
  }
};
