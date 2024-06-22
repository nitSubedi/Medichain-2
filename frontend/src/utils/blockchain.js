
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

export const requestAccount = async() => {
    const accounts = await provider.listAccounts();
    return accounts;
}

export const getContract = (address, abi) => {
    const signer = provider.getSigner();
    return new ethers.Contract(address, abi, signer);
}