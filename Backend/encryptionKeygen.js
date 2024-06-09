const crypto = require('crypto');

// Generate a random encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex'); // 256 bits (32 bytes)
};

// Export the function to make it accessible from other files
const encryptionKey = generateEncryptionKey();
console.log('Generated encryption key:', encryptionKey);

