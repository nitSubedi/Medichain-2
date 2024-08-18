const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cors = require('cors');
const crypto = require('crypto')
const {contractAddresses,contractABIs} = require('../utils/contracts')
const {getContract}= require('../utils/blockchain');
const createWallet = require('../utils/wallet');
const ethers = require('ethers');


const decrypt = (text, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403); 
        }
        req.user = user; 
        next(); 
      });
};

router.post('/login', async (req, res) => {
    const { userID, password, role, phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password or phoneNumber" });
        }
        const iv = Buffer.from(user.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let decryptedUserID = '';
        if (user.userID) {
            decryptedUserID = decipher.update(user.userID, 'hex', 'utf-8');
            decryptedUserID += decipher.final('utf-8');
        } else {
            console.error("Encrypted wallet address is missing");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch || decryptedUserID !== userID || user.role !== role) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        
        const token = jwt.sign(
            { userID: user.userID, role: user.role, walletAddress:user.walletAddress, phone: user.phoneNumber, private: user.privateKey, addressed: user.addressInteracted  },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.user.userID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedWalletAddress = decrypt(user.walletAddress,iv)

        const decryptedUserID = decrypt(user.userID,iv);

        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        res.json({
            userID: decryptedUserID,
            role: user.role,
            walletAddress: decryptedWalletAddress,
            phoneNumber: user.phoneNumber,
            privateKey: decryptedPrivateKey,
            addressInteracted: user.addressInteracted
        });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/addProviderorPatient',authenticateToken, async(req,res)=>{
    const {userID,address} = req.body;
        if (!userID || !address) {
            return res.status(400).json({ message: 'userID and address are required' });
          }
    try{
            const user = await User.findOneAndUpdate(
              { userID },
              { $addToSet: { addressInteracted: address } }, 
              { new: true } 
            );
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
          
              res.json({ message: 'Address added successfully', user });
    }catch(error){
        console.error("Unable to add patient or provider",error);
        res.status(500).json({message: "Server Error"})
    }
});




module.exports = router;
