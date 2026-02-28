const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');

//user ko register krne ke liye function
async function registerUser(req, res) {
    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ 
        email
    });

    if (isUserAlreadyExist) {
        return res.status(400).json({message: 'User already exists'});

    }
    //password hashing isliye ki jaati hai taaki jab saaara data website ka leak ho jaaye to bhi users ke password safe rahe uske liye liabrary use ki jaati hai jiska naam bcrypt hai
    const hashedPassword = await bcrypt.hash(password, 10);//yaahaan 10 ka matlab hai ki humne 10 rounds of salting kiye hain
    //user create krna hai
    const user =  await userModel.create({
        fullname,
        email,
        password: hashedPassword
    });
    //token creation
    const token = jwt.sign({
        Id: user._id,   
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
        }
    })
        }
async function loginUser(req, res) {
const { email, password } = req.body;
const user = await userModel.findOne({ email });
if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
}
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
}
const token = jwt.sign({
    Id: user._id,
}, process.env.JWT_SECRET)
res.cookie("token", token)
res.status(200).json({
    message: 'User logged in successfully',
    user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
    }
})
        }
 function logoutUser(req, res) {
res.clearCookie("token");
res.status(200).json({
    message: 'User logged out successfully'
})
}
async function registerFoodPartner(req, res) {
const { name, email, password,phone,address,contactName } = req.body;
const isAccountAlreadyExist = await foodPartnerModel.findOne({ 
    email
});
if (isAccountAlreadyExist) {
    return res.status(400).json({message: 'FoodPartner already exists'});
}
const hashedPassword = await bcrypt.hash(password, 10);
const foodPartner =  await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName,
   
});

const token = jwt.sign({
    Id: foodPartner._id,   
}, process.env.JWT_SECRET)
res.cookie("token", token)
res.status(201).json({
    message: 'FoodPartner registered successfully',
    foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        address: foodPartner.address,
        phone: foodPartner.phone,
        contactName: foodPartner.contactName

    }

})


}

async function loginFoodPartner(req, res) {
const { email, password } = req.body;
const foodPartner = await foodPartnerModel.findOne({ email });
if (!foodPartner) {
    return res.status(400).json({ message: 'Invalid email or password' });
}   
const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
}
const token = jwt.sign({
    Id: foodPartner._id,
}, process.env.JWT_SECRET)
res.cookie("token", token)
res.status(200).json({
    message: 'FoodPartner logged in successfully',
    foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,

    }
})
        }
function logoutFoodPartner(req, res) {
res.clearCookie("token");
res.status(200).json({
    message: 'FoodPartner logged out successfully'
})
        }


        module.exports = {
            registerUser,
            loginUser,
            logoutUser,
            registerFoodPartner,
            loginFoodPartner,
            logoutFoodPartner
        }//ese export kiya kyu ki ek file mein bahut saare controllers ho skte hai jabki export ek hi baar hota hai isliye hum object ke form mein export karte hain

        //user ko login krne ke liye function
        //3:33:16 baaki