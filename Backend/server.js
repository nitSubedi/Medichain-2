// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/routes');
//const { connectToEthereum } = require('./config/ethereum');
const {createUser} = require('./controller/userController');
const {connectToDatabase} = require('./config/database');
const {generateWalletAddress} = require('./utils/walletutil');


// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Connect to Ethereum
//connectToEthereum();

// Routes
//app.use('/api/auth', authRoutes);
//app.use('/api/record', recordRoutes);

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Medical History App API');
});

app.post("/models/user", async(req, res) => {
    const { userID, password, role, phoneNumber} = req.body;
    try {
        const walletAddress = generateWalletAddress();

        await createUser(userID, password, role, phoneNumber, walletAddress);
        res.status(201).json({ message: 'User created successfully' });
    }catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
})



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
