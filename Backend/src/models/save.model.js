const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    user : {
            type: mongoose.Schema.Types.ObjectId, //iska matlab hai ki ye user id ko reference karega   
             ref: 'user',//yeh User model ko refer kar raha hai
             required: true
            },
    food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food',//yeh Food model ko refer kar raha hai
            required: true
            }
},{
    timestamps: true //yeh automatically createdAt aur updatedAt fields ko add kar dega har document me
});
// ✅ composite unique index
// saveSchema.index({ user: 1, food: 1 }, { unique: true });
const saveModel = mongoose.model('save', saveSchema);
module.exports = saveModel;