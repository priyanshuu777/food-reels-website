const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken'); 
async function authFoodPartnerMiddleware(req, res, next) {//yeh middleware function hai jo food partner ko authenticate karega
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Bhai Pehele Login Krle' });

    }
    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET);//yeh token ko verify karega aur iska output hoga decoded object for example { Id: 'someid', iat: timestamp }
        
        const foodPartner = await foodPartnerModel.findById(decoded.Id);//decoded.Id mtlb jo Id humne token me dala tha jab humne sign kiya tha

        req.foodPartner = foodPartner;//ab humne jo foodPartner mila hai usko response object me attach kar diya taaki aage middleware ya controller me use kar sake
        next();//next middleware ya controller ko call karne ke liye
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token. Please login again.' });
    } 

}

async function authUserMiddleware(req, res, next) {//yeh middleware function hai jo user ko authenticate karega
const token = req.cookies.token;
if (!token) {
    return res.status(401).json({ message: 'Bhai Pehele Login Krle' });
}
try {
    const decoded =jwt.verify(token, process.env.JWT_SECRET);//yeh token ko verify karega aur iska output hoga decoded object for example { Id: 'someid', iat: timestamp }
    const user = await userModel.findById(decoded.Id);//decoded.Id mtlb jo Id humne token me dala tha jab humne sign kiya tha
    req.user = user;
    next();//next middleware ya controller ko call karne ke liye
} catch (error) {
    return res.status(401).json({ message: 'Invalid Token. Please login again.' });


}
}
module.exports = 
{
authFoodPartnerMiddleware,
authUserMiddleware

}

