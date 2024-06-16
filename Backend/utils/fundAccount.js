require('dotenv').config();
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const signer = provider.getSigner(0);

async function fundAccount(targetAddress, amountInEther) {
    const tx = await signer.sendTransaction({
        to: targetAddress,
        value: ethers.utils.parseEther(amountInEther)
    });
    await tx.wait();
    console.log(`Funded ${targetAddress} with ${amountInEther} Ether`);
}
module.exports = { fundAccount };