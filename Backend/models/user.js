const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const {generateIV}= require('../encryptionKeygen');
require('dotenv').config();

const userSchema = new mongoose.Schema({userID:{type: String, required:true,unique:true},
    password: {type:String, required:true},
    role:{type:String, enum:['patient', 'healthcare_provider'], required: true},
    phoneNumber:{type:String, required:true},
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

        const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from( process.env.ENCRYPTION_KEY,'hex'), iv);
        let encryptedWalletAddress = cipher.update(user.walletAddress, 'utf-8', 'hex');
        encryptedWalletAddress += cipher.final('hex');

        const pCipher = crypto.createCipheriv('aes-256-cbc',Buffer.from( process.env.ENCRYPTION_KEY,'hex'), iv);
        let encryptedPrivateKey = pCipher.update(user.privateKey, 'utf-8', 'hex');
        encryptedPrivateKey += pCipher.final('hex');
        
        user.privateKey = encryptedPrivateKey;
        user.walletAddress = encryptedWalletAddress;
        user.iv = iv.toString('hex'); 
    }

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
