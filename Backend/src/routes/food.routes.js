const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middleware/auth.middleware');//ye require kiya kyu ki is se protected rahega ye route mtlb food partner hi new  food add kar payega
const multer = require('multer');//ye file upload karne ke liye use hota hai

const upload = multer({
    storage: multer.memoryStorage(),//ye file ko memory me store karega
})
//POST api/food/ ye vaala route hai jaha food partner new food item add kar payega
router.post('/',authMiddleware.authFoodPartnerMiddleware,
                upload.single("video"), 
                foodController.createFood)
//GET api/food/ ye vaala route hai jaha user sabhi food items dekh payega
router.get('/', authMiddleware.authUserMiddleware,
                foodController.getFoodItems
)

router.post('/like',authMiddleware.authUserMiddleware,
                foodController.likeFood
)

router.post('/save',authMiddleware.authUserMiddleware,
                foodController.saveFood
)
router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)



module.exports = router;
