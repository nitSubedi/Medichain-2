const ethers = require('ethers');

function createWallet(privateKey) {
    return new ethers.Wallet(privateKey);
}

module.exports = createWallet;
