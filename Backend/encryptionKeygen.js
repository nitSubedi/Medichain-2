const crypto = require('crypto');

// Generate a random encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex'); // 256 bits (32 bytes)
};

// Export the function to make it accessible from other files
const encryptionKey = generateEncryptionKey();
console.log('Generated encryption key:', encryptionKey);
console.log('Encryption Key Length:', encryptionKey.length);



const secret = crypto.randomBytes(64).toString('hex');
//console.log(secret);



// Generate a random IV
function generateIV() {
  return crypto.randomBytes(16); // IV length should match the block size of the encryption algorithm (16 bytes for AES)
}

module.exports = {
  generateIV
};

