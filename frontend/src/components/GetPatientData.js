import React, { useState, useEffect} from 'react';
import { getContract } from '../utils/blockchain';
import { contractABIs, contractAddresses } from '../utils/contracts';

const GetPatientData = ({patientAddress, providerAddress}) => {
    const [patientData, setPatientData] = useState({});

    useEffect(()=>{
        const fetchData = async ()=> {
            const allergiesContract = getContract(contractAddresses.allergies, contractABIs.allergies);
            const demographicsContract = getContract(contractAddresses.demographics, contractABIs.demographics);
            const immunizationsContract = getContract(contractAddresses.immunizations, contractABIs.immunizations);
            const insuranceContract = getContract(contractAddresses.insurance, contractABIs.insurance);
            const medicalConditionsContract = getContract(contractAddresses.medicalConditions, contractABIs.medicalConditions);
            const medicationsContract = getContract(contractAddresses.medications, contractABIs.medications);
            const mentalHistoryContract = getContract(contractAddresses.mentalHistory, contractABIs.mentalHistory);
            const surgeriesContract = getContract(contractAddresses.surgeries, contractABIs.surgeries);

            const allergies = await allergiesContract.getAllergies(patientAddress, { from: providerAddress });
            const demographics = await demographicsContract.getDemographics(patientAddress, { from: providerAddress });
            const immunizations = await immunizationsContract.getImmunization(patientAddress, { from: providerAddress });
            const insurance = await insuranceContract.getInsurance(patientAddress, { from: providerAddress });
            const medicalConditions = await medicalConditionsContract.getMedicalCondition(patientAddress, { from: providerAddress });
            const medications = await medicationsContract.getMedication(patientAddress, { from: providerAddress });
            const mentalHistory = await mentalHistoryContract.getDiagnosis(patientAddress, { from: providerAddress });
            const surgeries = await surgeriesContract.getSurgery(patientAddress, { from: providerAddress });

            setPatientData({
                allergies,
                demographics,
                immunizations,
                insurance,
                medicalConditions,
                medications,
                mentalHistory,
                surgeries
            });
        }
        fetchData();
    },[patientAddress, providerAddress]);

    return(
        <div>
            <h2>Patient Data for {patientAddress}</h2>
            <pre>{JSON.stringify(patientData, null, 2)}</pre>
        </div>
    )
}
export default GetPatientData;



