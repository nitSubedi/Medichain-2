const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({userID:{type: String, required:true,unique:true},
    password: {type:String, required:true},
    role:{type:String, enum:['patient', 'healthcare_provider'], required: true},
    phoneNumber:{type:String, required:true},
    walletAddress:{type:String, required:true}
    });

userSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password before saving
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    // Encrypt the userID and walletAddress before saving
    if (user.isModified('userID')) {
        user.userID = crypto.AES.encrypt(user.userID, process.env.SECRET_KEY).toString();
    }

    if (user.isModified('walletAddress')) {
        user.walletAddress = crypto.AES.encrypt(user.walletAddress, process.env.SECRET_KEY).toString();
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
