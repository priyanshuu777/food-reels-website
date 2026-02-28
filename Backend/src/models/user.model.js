//creating a user model because it is neccessary for user authentication
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    }
},
{
    timestamps: true//yeh automatically createdAt aur updatedAt fields ko add kar dega har document me
}
);

const userModel = mongoose.model('user', userSchema);
// Mongoose ka function jo:
// schema ko MongoDB se jodta hai
// CRUD operations ke methods deta hai

module.exports = userModel;