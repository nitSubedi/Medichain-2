require('dotenv').config();
const ethers = require('ethers');
const { Web3 } = require('web3');

const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const web3 = new Web3(process.env.GANACHE_URL); // Adjust the URL to your Ganache setup

const signer = provider.getSigner(0);

async function fundAccount(targetAddress, amountInEther) {
    const tx = await signer.sendTransaction({
        to: targetAddress,
        value: ethers.utils.parseEther(amountInEther)
    });
    await tx.wait();
    console.log(`Funded ${targetAddress} with ${amountInEther} Ether`);
}
const mnemonic = "film exotic skill board oyster room reject trend sugar parade cabbage buffalo";
const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
let counter = 0;
async function getPrefundedAccount(index) {
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;
        return {
            walletAddress,
            privateKey
        };
    } 

function getCounter() {
    const data = fs.readFileSync('./counter.json');
    const json = JSON.parse(data);
    return json.index;
}

function incrementCounter() {
    ;
    const data = fs.readFileSync('./counter.json');
    const json = JSON.parse(data);
    json.index += 1;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}
module.exports = { fundAccount, getPrefundedAccount, getCounter,incrementCounter };