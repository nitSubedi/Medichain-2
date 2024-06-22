import React, { useState, useEffect} from 'react';
import { getContract } from '../utils/blockchain';
import { contractABIs, contractAddresses } from '../utils/contracts';


const UpdatePatientData = ({patientAddress, providerAddress, contractName, fieldName}) => {
    const [newData, setNewData] = useState({});

    const handleUpdate = async () => {
        const contract = getContract(contractAddresses[contractName], contractABIs[contractName]);
        

        switch(contractName){
            case 'allergies':
                await contract.addAllergy(patientAddress, newData, {from: providerAddress});
                break;
            case 'demographics':
                const[name, dateOfBirth, gender, homeAddress]= newData.split(',');
                await contract.setDemographics(patientAddress, name, dateOfBirth, gender, homeAddress,{from: providerAddress});
                break;
            case 'immunization':
                const[vaccine, administeredDate]= newData.split(',');
                await contract.addImmunization(patientAddress, vaccine, administeredDate,{from: providerAddress});
                break;
            case 'insurance':
                const[provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo] = newData.split(',');
                await contract.setInsurance(patientAddress,provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo,{from: providerAddress});
                break;
            case 'medicalConditions' :
                const[condition, diagnosisDate] = newData.split(',');
                await contract.addMedicalCondition(patientAddress, condition, diagnosisDate,{from: providerAddress});
                break;
            case 'medication':
                const [medicationName, dosage, startDate, endDate] = newData.split(',');
                await contract.addMedication(patientAddress, medicationName, dosage, startDate, endDate,{from: providerAddress});
                break;
            case 'mentalHealth':
                const[mentalHealthDiagnosis, dateDiagnosed] = newData.split(',');
                await contract.addDiagnosis(patientAddress, mentalHealthDiagnosis, dateDiagnosed,{from: providerAddress});
                break;
            case 'surgeries':
                const[surgeryType, surgeryDate]=newData.split(',');
                await contract.addSurgery(patientAddress, surgeryType, surgeryDate,{from: providerAddress});
                break;
            default:
                console.error("Unknown contract name");
        }
    };

    return (
        <div>
            <h3>Update {fieldName} in {contractName}</h3>
            <input
                type='text'
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                placeholder={'Enter new ${fieldName} data'}
            />
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default UpdatePatientData;