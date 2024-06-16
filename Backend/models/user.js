const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const {generateIV}= require('../encryptionKeygen');
require('dotenv').config();

const userSchema = new mongoose.Schema({userID:{type: String, required:true,unique:true},
    password: {type:String, required:true},
    role:{type:String, enum:['patient', 'healthcare_provider'], required: true},
    phoneNumber:{type:String, required:true, unique:true},
    walletAddress:{type:String, required:true},
    privateKey: {type:String, required:true},
    iv:{type:String, required:true}
    });

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    if (user.isModified('walletAddress')) {
        const iv = generateIV();
    
        const walletCipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let encryptedWalletAddress = walletCipher.update(user.walletAddress, 'utf-8', 'hex');
        encryptedWalletAddress += walletCipher.final('hex');
        user.walletAddress = encryptedWalletAddress;

        const privateCipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let encryptedPrivateKey = privateCipher.update(user.privateKey, 'utf-8', 'hex');
        encryptedPrivateKey += privateCipher.final('hex');
        user.privateKey = encryptedPrivateKey;

        const userCipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let encryptedUserID = userCipher.update(user.userID, 'utf-8', 'hex');
        encryptedUserID += userCipher.final('hex');
        user.userID = encryptedUserID;
        
        user.iv = iv.toString('hex'); 
    }

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
