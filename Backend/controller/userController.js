const mongoose = require('mongoose');
const User = require('../models/user');

const createUser = async (userID, password, role, phoneNumber, walletAddress) => {
  try {

    const newUser = new User({
        userID,
        password,
        role,
        phoneNumber,
        walletAddress
    });

    await newUser.save();
    console.log('User created successfully.');
  } catch (error) {
    console.error('Error creating user:', error);
  }

};

module.exports = { createUser };