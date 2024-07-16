import { contractABIs, contractAddresses} from "../utils/contracts";
import {Web3} from "web3";




const web3 = new Web3(process.env.GANACHE_URL)

const allergyInstance = new web3.eth.Contract(contractABIs.allergies,"0xc02F1f494a5309d572279C5740E8323D376eF70f");
const demographyInstance = new web3.eth.Contract(contractABIs.demographics,"0xBeeF667d7570140a7BbEa8eeff2E051dad5d703B");
const immunizationInstance = new web3.eth.Contract(contractABIs.immunization,"0xcb5bca9a04A6Aa68C0CFAc3cf50108c1f6220E2f");
const insuranceInstance = new web3.eth.Contract(contractABIs.insurance,"0x7A215bc1E635C9C258d3345708cd5275b076a320");
const medicalConditionInstance = new web3.eth.Contract(contractABIs.medicalConditions,"0x3104C035d32148988aAa586b2619bd48F4bE4f29");
const medicationInstance = new web3.eth.Contract(contractABIs.medications,"0x15D586652bc6DD95a3B7E1058E635E65Bc318c6E");
const mentalInstance = new web3.eth.Contract(contractABIs.mentalHealth,"0x598415A686C5175202E48aad0c1D4bC11fF2B365");
const surgeryInstance  = new web3.eth.Contract(contractABIs.surgeries,"0xAfE380f12275a24991099920bE772c391d20A616");

 async function signAndSendTransaction(providerAddress, contractAddress, txData) {
    const privateKey = process.env.PRIVATE_KEY; // Ensure your private key is stored securely

    const transaction = {
        from: providerAddress,
        to: contractAddress,
        data: txData,
        nonce: await web3.eth.getTransactionCount(providerAddress, 'pending'),
        gasPrice: await web3.eth.getGasPrice(),
        gas: await web3.eth.estimateGas({
            from: providerAddress,
            to: contractAddress,
            data: txData
        })
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}


 export async function updatePatientData(patientAddress,providerAddress,contractName,newData){
    try{
        console.log('adding data for patient:', patientAddress, 'from provider:', providerAddress);
        let results= "";
        switch(contractName){
            case 'allergies':
                const allergy = newData[0];
                const txData = allergyInstance.methods.addAllergy(patientAddress, allergy).encodeABI();
                results = await signAndSendTransaction(providerAddress, contractAddresses.allergies, txData);
                break;
            case 'demographics':
                const [name, dateOfBirth, gender, homeAddress] = newData;
                results = await demographyInstance.methods.setDemographics(patientAddress, name, dateOfBirth, gender, homeAddress).send({from:providerAddress});
                break;
            case 'immunizations':
                const[vaccine, administeredDate] = newData;
                results = await immunizationInstance.methods.addImmunization(patientAddress, vaccine, administeredDate).send({from:providerAddress});
                break;
            case 'insurance':
                const[provider , policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo] = newData;
                results = await insuranceInstance.methods.setInsurance(patientAddress, provider, policyNumber, coverageDetails,coverageLimit, effectiveDateStart,effectiveDateEnd, contactInfo).send({from:providerAddress});
                break;
            case 'medicaticalConditions':
                const[conditions, diagnosisDate] = newData;
                results = await medicalConditionInstance.methods.addMedicalCondition(patientAddress, conditions, diagnosisDate).send({from: providerAddress});
                break;
            case 'medications':
                const[medicationName, dosage, startDate, endDate] = newData;
                results = await medicationInstance.methods.addMedication(patientAddress, medicationName, dosage, startDate, endDate).send({from:providerAddress});
                break;
            case 'mentalHealth':
                const[mentalHealthDiagnosis, dateDiagnosed] = newData;
                results = await mentalInstance.methods.addDiagnosis(patientAddress, mentalHealthDiagnosis, dateDiagnosed).send({from: providerAddress});
                break;
            case 'surgeries':
                const[surgeryType, surgeryDate] = newData;
                results = await surgeryInstance.methods.addSurgery(patientAddress, surgeryType, surgeryDate).send({from: providerAddress});
                break;
            default:
                console.log(" contract Name not found");
        }
        console.log("Successfully added/updated patient data", results);
    }catch(error){
        console.log("Could Not Add/Update patient data",error);
    }

 }