
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const recordRoutes = require('./routes/routes');
const {createUser} = require('./controller/userController');
const {connectToDatabase} = require('./config/database');
const {generateWalletAddress} = require('./utils/walletutil');
const User = require('./models/user');
const { ethers } = require('ethers');
const cors = require('cors');
const {fundAccount, getPrefundedAccount, getCounter,incrementCounter} = require('./utils/fundAccount');


const app = express();

app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use(cors());
app.use('/api/auth', authRoutes);


const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
let counter = 0
app.post("/register", async(req, res) => {
    const { userID, password, role, phoneNumber} = req.body;
    try {
        
        const {walletAddress, privateKey} = await getPrefundedAccount(counter);
        

        await createUser(userID, password, role, phoneNumber, walletAddress, privateKey);

       counter++;

        const token = jwt.sign(
            { userID, role, walletAddress, phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        res.status(201).json({ message: 'User created successfully', token });
    }catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));