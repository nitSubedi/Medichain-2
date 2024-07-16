
import { contractABIs, contractAddresses} from "../utils/contracts";
import {Web3} from "web3";


const web3 = new Web3('http://127.0.0.1:8545')
const contractInstance = new web3.eth.Contract(contractABIs.accessControl, contractAddresses.accessControl);

export async function grantReadAccess( patientAddress, providerAddress){
    try{
        
        const accounts = await web3.eth.getAccounts();
        const tx = contractInstance.methods.grantReadAccess(providerAddress,patientAddress).send({from:patientAddress});
        console.log('granting read access to :', providerAddress, 'from:', patientAddress)
        console.log("Access granted", tx)  
    }
    catch(error){
        console.log("Error Granting Access", error)
    }
}

export async function grantUpdateAccess(patientAddress, providerAddress){
    try{
        
        const accounts = await web3.eth.getAccounts();
        const tx = contractInstance.methods.grantUpdateAccess(patientAddress,providerAddress).send({from:patientAddress})
        console.log('granting update access to :', providerAddress, 'from:', patientAddress)
        console.log("Access granted", tx);
    } catch(error){
        console.log("Error granting Access", error)
    }
}