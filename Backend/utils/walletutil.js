const { ethers } = require("ethers");

function generateWalletAddress() {
    const wallet = ethers.Wallet.createRandom();
    return {
        walletAddress : wallet.address,
        privateKey: wallet.privateKey
    };
}

module.exports = { generateWalletAddress };
