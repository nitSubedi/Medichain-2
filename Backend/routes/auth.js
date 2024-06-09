const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();



// Login route
app.post('/login', async (req, res) => {
    try {
        const { userID, password } = req.body;

        const user = await User.findOne({ userID: crypto.AES.encrypt(userID, process.env.ENCRYPTION_KEY).toString() });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        
        const decryptedUserID = crypto.AES.decrypt(user.userID, process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8);
        const decryptedWalletAddress = crypto.AES.decrypt(user.walletAddress, process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                userID: decryptedUserID,
                walletAddress: decryptedWalletAddress,
            }
        });
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
});

module.exports = router;
