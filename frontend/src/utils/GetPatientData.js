import { contractABIs, contractAddresses} from "../utils/contracts";
import {Web3} from "web3";


var web3 = new Web3(process.env.GANACHE_URL)

const allergyInstance = new web3.eth.Contract(contractABIs.allergies,"0xc02F1f494a5309d572279C5740E8323D376eF70f");
 const demographyInstance = new web3.eth.Contract(contractABIs.demographics,"0xBeeF667d7570140a7BbEa8eeff2E051dad5d703B");
 const immunizationInstance = new web3.eth.Contract(contractABIs.immunization,"0xcb5bca9a04A6Aa68C0CFAc3cf50108c1f6220E2f");
 const insuranceInstance = new web3.eth.Contract(contractABIs.insurance,"0x7A215bc1E635C9C258d3345708cd5275b076a320");
 const medicalConditionInstance = new web3.eth.Contract(contractABIs.medicalConditions,"0x3104C035d32148988aAa586b2619bd48F4bE4f29");
 const medicationInstance = new web3.eth.Contract(contractABIs.medications,"0x15D586652bc6DD95a3B7E1058E635E65Bc318c6E");
 const mentalInstance = new web3.eth.Contract(contractABIs.mentalHealth,"0x598415A686C5175202E48aad0c1D4bC11fF2B365");
 const surgeryInstance  = new web3.eth.Contract(contractABIs.surgeries,"0xAfE380f12275a24991099920bE772c391d20A616");

 export async function getPatientData(patientAddress, providerAddress){
    try{
        console.log('Retrieving data for patient:', patientAddress, 'from provider:', providerAddress);
        const allergy = await allergyInstance.methods.getAllergies(patientAddress).call({from: providerAddress, gas: 50000});
        const demographics = await demographyInstance.methods.getDemographics(patientAddress).call({from:providerAddress, gas: 500000});
        const immunization = await immunizationInstance.methods.getImmunization(patientAddress).call({from:providerAddress, gas: 50000000});
        const insurance = await insuranceInstance.methods.getInsurance(patientAddress).call({from:providerAddress, gas: 500000});
       const medicalConditions = await medicalConditionInstance.methods.getMedicalCondition(patientAddress).call({from:providerAddress, gas: 500000});
       const medications = await medicationInstance.methods.getMedication(patientAddress).call({from:providerAddress, gas: 500000});
        const mentalHealth = await mentalInstance.methods.getDiagnosis(patientAddress).call({from:providerAddress, gas: 500000});
        const surgeries = await surgeryInstance.methods.getSurgery(patientAddress).call({from:providerAddress, gas: 500000});

        const results = {
          allergy,
           demographics,
           immunization,
           insurance,
           medicalConditions,
          medications,
          mentalHealth,
        surgeries
        };
        console.log("data retrieved successfully", results);
        return results;
    }catch(error){
        console.log("failed to retrieve data", error);
    }
 };

