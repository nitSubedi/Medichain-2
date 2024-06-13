const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user'); // Assuming your model is named 'user'

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
    const { userID, password, role } = req.body;

    try {
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch || user.userID !== userID || user.role !== role) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        

        // If username and password match, generate JWT token
        const token = jwt.sign(
            { userID: user.userID, role: user.role, walletAddress:user.walletAddress, phone: user.phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/user', authenticateToken, (req, res) => {
    const iv = Buffer.from(user.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let decryptedWalletAddress = decipher.update(user.walletAddress, 'hex', 'utf-8');
        decryptedWalletAddress += decipher.final('utf-8');

        res.json({
            userID: user.userID,
            role: user.role,
            walletAddress: decryptedWalletAddress,
            phoneNumber: user.phoneNumber,
            
        });
});

module.exports = router;
