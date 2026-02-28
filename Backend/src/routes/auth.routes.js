const express = require('express');//kyu ki express router ka use karenge
const router = express.Router();    
const authController = require('../controllers/auth.controller');
//creating API for user authentication
//user auth APIs
router.post('/user/register',authController.registerUser)//yeh route hai jahan par user apna data bhejega register karne ke liye
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
//food partner auth APIs    
router.post('/foodpartner/register', authController.registerFoodPartner)
router.post('/foodpartner/login', authController.loginFoodPartner)
router.get('/foodpartner/logout', authController.logoutFoodPartner)
module.exports = router; 