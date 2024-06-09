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
    iv:{type:String, required:true}
    });

userSchema.pre('save', async function (next) {
    const user = this;

 
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    if (user.isModified('userID')) {
        
        
    }

    if (user.isModified('walletAddress')) {
        const iv = generateIV();

        const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from( process.env.ENCRYPTION_KEY,'hex'), iv);
        let encryptedWalletAddress = cipher.update(user.walletAddress, 'utf-8', 'hex');
        encryptedWalletAddress += cipher.final('hex');
        
        
        user.walletAddress = encryptedWalletAddress;
        user.iv = iv.toString('hex'); 

    }

    next();
});

/*userSchema.methods.decryptUserID = function () {
    try {
        return crypto.AES.decrypt(this.get('userID'), process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting userID:', error);
        return ''; 
    }
};

userSchema.methods.decryptWalletAddress = function () {
    try {
        return crypto.AES.decrypt(this.get('walletAddress'), process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting walletAddress:', error);
        return ''; 
    }
};


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.statics.authenticate = async function (userID, password) {
    try {
       
        const encryptedUserID = crypto.AES.encrypt(userID, process.env.ENCRYPTION_KEY).toString();

       
        const user = await this.findOne({ userID: encryptedUserID });

        if (!user) {
            throw new Error('User not found');
        }

       
        const decryptedUserID = user.decryptUserID();

        if (decryptedUserID !== userID) {
            throw new Error('Invalid user credentials');
        }

       
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return user;
    } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Authentication failed');
    }
};*/



const User = mongoose.model('User', userSchema);

module.exports = User;
