const mongoose = require('mongoose');
const User = require('../models/user');
const{generateIV}=require('../encryptionKeygen');

const createUser = async (userID, password, role, phoneNumber, walletAddress,) => {
  try {
    const iv = generateIV();

    const newUser = new User({
        userID,
        password,
        role,
        phoneNumber,
        walletAddress,
        iv:iv.toString('hex')
    });

    await newUser.save();
    console.log('User created successfully.');
  } catch (error) {
    console.error('Error creating user:', error);
  }

};

module.exports = { createUser };