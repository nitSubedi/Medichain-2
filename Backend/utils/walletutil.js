const { ethers } = require("ethers");

// Function to generate a new Ethereum wallet address
function generateWalletAddress() {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    // Return the wallet address
    return wallet.address;
}

module.exports = { generateWalletAddress };
