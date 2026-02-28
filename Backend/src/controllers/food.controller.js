const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid")
const  LikeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
async function createFood(req, res) {
  /*
  console.log("Creating food item");
    console.log(req.foodPartner);
    iska output for ex kuch esa hoga
    {
  _id: new ObjectId('6947bb944cb54bec8d5e5c1c'),
  name: 'food-partner',
  email: 'foodpartner@gmail.com',
  password: '$2b$10$XpOTB7oUulYOlVgddhanq./g.CVA12XguU.TKWY4hPnFHwbrA95uW',
  __v: 0
}
    */ 
  
/* 
    console.log(req.body)//isme hum uploaded file nahi dekh payenge kyuki file multer ke through aati hai
    iska 
    [Object: null prototype] {
  name: 'test-meal',
  description: 'test-description'
}
    */
   /*
    console.log(req.file)//yeh file multer se aayegi jo humne upload ki hai
    iska output for ex kuch esa hoga
    {
  fieldname: 'video',
  originalname: '14000992_1080_1920_30fps.mp4',
  encoding: '7bit',
  mimetype: 'video/mp4',
  buffer: <Buffer 00 00 00 1c 66 74 79 70 69 73 6f 35 00 00 02 00 69 73 6f 35 69 73 6f 36 6d 70 34 31 00 00 03 2a 6d 6f 6f 76 00 00 00 6c 6d 76 68 64 00 00 00 00 00 00 ... 2462675 more bytes>,
  size: 2462725
}
    */
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());//uuid isliye use kiya taaki har file ka unique name generate ho jaye for example 123e4567-e89b-12d3-a456-426614174000
    /*
    console.log(fileUploadResult);
    iska output for ex kuch esa hoga 
    {
  fileId: '694a8b175c7cd75eb86877ee',
  name: '83961e2f-bf72-488f-88bd-b88fa653e0ee_BETZeZg3B',
  size: 2462725,
  versionInfo: { id: '694a8b175c7cd75eb86877ee', name: 'Version 1' },
  filePath: '/83961e2f-bf72-488f-88bd-b88fa653e0ee_BETZeZg3B',
  url: 'https://ik.imagekit.io/xjkdqdetx/83961e2f-bf72-488f-88bd-b88fa653e0ee_BETZeZg3B',
  height: 1920,
  width: 1080,
  bitRate: 3244377,
  duration: 6,
  videoCodec: 'h264',
  fileType: 'non-image',
  AITags: null,
  description: null
}
    */
    //hum kisi file ko seedha server pr save nhi karte balki hum use kisi cloud storage pr upload karte hain jaise AWS S3, Cloudinary, etc. kyu ki production me hamare paas store krne k liye SSD ya hard drive nahi hota kyu ki bahut zyada data hota hai isliye hum cloud storage ka use karte hain 
    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,//for ex url: 'https://ik.imagekit.io/xjkdqdetx/83961e2f-bf72-488f-88bd-b88fa653e0ee_BETZeZg3B',
      price: req.body.price || 0,
      foodPartner: req.foodPartner._id,
    });
    res.status(201).json({
      message: 'Food item created successfully',
      food: foodItem,
    });
  }
    /*iska output kuch esa hoga
    {
    "message": "Food item created successfully",
    "food": {
        "name": "test-meal",
        "video": "https://ik.imagekit.io/xjkdqdetx/288d188a-ed5c-4bb0-967e-7ffbc1bd25a3_7VOyBSqKA",
        "description": "test-description",
        "_id": "694bb0013a17e6c83b052f02",
        "__v": 0
    }
}
    */
      
async function getFoodItems(req, res) {//ye function sabhi food items ko fetch karega user ke liye
  const foodItems = await foodModel.find().populate('foodPartner', '_id name')
  res.status(200).json({
    message: 'Food items fetched successfully',
    foodItems: foodItems,
  });
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const isAlreadyLiked = await LikeModel.findOne({
      user: userId,
      food: foodId
    });

    if (isAlreadyLiked) {
      await LikeModel.deleteOne({ user: userId, food: foodId });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: -1 } },
        { new: true }              // 👈 IMPORTANT
      );

      return res.json({
        liked: false,               // 👈 FRONTEND KO SIGNAL
        likeCount: updatedFood.likeCount
      });
    }

    await LikeModel.create({ user: userId, food: foodId });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    return res.json({
      liked: true,
      likeCount: updatedFood.likeCount
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}




async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const isAlreadySaved = await saveModel.findOne({
      user: userId,
      food: foodId
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: userId, food: foodId });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { saveCount: -1 } },
        { new: true }
      );

      return res.json({
        saved: false,
        saveCount: updatedFood.saveCount
      });
    }

    await saveModel.create({ user: userId, food: foodId });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { saveCount: 1 } },
      { new: true }
    );

    return res.json({
      saved: true,
      saveCount: updatedFood.saveCount
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}



module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood
};
