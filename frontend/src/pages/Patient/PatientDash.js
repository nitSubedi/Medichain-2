import React, { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, json, redirect } from 'react-router-dom';
import { getUserData } from '../../utils/api'; 
import { contractABIs, contractAddresses} from "../../utils/contracts";
import {Web3} from "web3";

let web3

if (window.ethereum) {
   web3 = new Web3(window.ethereum);
} else {
  console.error('MetaMask not detected. Please install MetaMask and reload the page.');
}

// Loader function to get user data
export async function loader() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/login'); // Redirect if no token
  }
  const res = await getUserData();
  return json(res.data);
}

function PatientDash() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const [providerAddress, setProviderAddress] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [account, setAccount] = useState('');
 const [patientData, setPatientData] = useState('')
 const [mode, setMode] = useState('')

  useEffect(() => {
    if (window.ethereum && account === '') {
      connectMetaMask();
    }
  }, [account]);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setPatientAddress(accounts[0])
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
    
  };

  useEffect(() => {
    connectMetaMask();
  }, []);

  function handleClick() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  }
  const allergyInstance = new web3.eth.Contract(contractABIs.allergies, contractAddresses.allergies);
  const demographyInstance = new web3.eth.Contract(contractABIs.demographics, contractAddresses.demographics);
  const immunizationInstance = new web3.eth.Contract(contractABIs.immunization, contractAddresses.immunization);
  const insuranceInstance = new web3.eth.Contract(contractABIs.insurance, contractAddresses.insurance);
  const medicalConditionInstance = new web3.eth.Contract(contractABIs.medicalConditions, contractAddresses.medicalConditions);
  const medicationInstance = new web3.eth.Contract(contractABIs.medications, contractAddresses.medications);
  const mentalInstance = new web3.eth.Contract(contractABIs.mentalHealth, contractAddresses.mentalHealth);
  const surgeryInstance = new web3.eth.Contract(contractABIs.surgeries, contractAddresses.surgeries);


  const contractInstance = new web3.eth.Contract(contractABIs.accessControl, contractAddresses.accessControl);

  const handleGrantReadAccess = async () => {
    try {
      //console.log('granting read access to :', providerAddress, 'from:', account)
      //const permissionCheck = contractInstance.methods.hasReadPermission(account,providerAddress).call()
      const allergies = await allergyInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const dem = await demographyInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000,  gasPrice:20000000000});
      const imm = await immunizationInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const ins = await await insuranceInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const medC = await medicalConditionInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const meds = await medicationInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const mental = await mentalInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const surgery = await surgeryInstance.methods.grantReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});

      const tx = {
        allergies,
        dem,
        imm,
        ins,
        medC,
        meds,
        mental,
        surgery
      }
      
      
      alert(tx)
      
      console.log("Access granted", tx ) 
    } catch (error) {
      console.error('Error granting read access:', error);
      alert('Failed to grant read access');
    }
  };

  const handleGrantUpdateAccess = async () => {
    try {
      
      const allergies = await allergyInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const dem = await demographyInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const imm = await immunizationInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const ins = await await insuranceInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const medC = await medicalConditionInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const meds = await medicationInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const mental = await mentalInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});
      const surgery = await surgeryInstance.methods.grantUpdateAccess(account,providerAddress).send({from:account, gasPrice:20000000000});

      const tx = {
        allergies,
        dem,
        imm,
        ins,
        medC,
        meds,
        mental,
        surgery
      }
      console.log('granting update access to :', providerAddress, 'from:', patientAddress)
      console.log("Access granted", tx);
      alert(tx)
    } catch (error) {
      console.error('Error granting update access:', error);
      alert('Failed to grant update access');
    }
  };

  const handleRead = async () => {
    console.log('Read mode selected');
    setMode('read');
    try {
      
      console.log('getting data for patient :');
      const allergies = await allergyInstance.methods.getAllergies(account).call({from: account, gas: 3000000});
      const demographics = await demographyInstance.methods.getDemographics(account).call({ from: account, gas: 3000000 });
      const immunizations = await immunizationInstance.methods.getImmunization(account).call({ from: account, gas: 3000000});
      const insurance = await insuranceInstance.methods.getInsurance(account).call({ from: account, gas: 3000000});
      const medicalConditions = await medicalConditionInstance.methods.getMedicalCondition(account).call({ from: account, gas: 3000000});
      const medications = await medicationInstance.methods.getMedication(account).call({ from: account, gas: 3000000});
      const mentalHealth = await mentalInstance.methods.getDiagnosis(account).call({ from: account, gas: 3000000 });
      const surgeries = await surgeryInstance.methods.getSurgery(account).call({ from: account, gas: 3000000 });

     
      const formattedAllergies = allergies.map(allergy => ({
        allergy: allergy.allergy,
      }));

      const formattedDemographics = {
        name: demographics[0],
        dateOfBirth: demographics[1],
        gender: demographics[2],
        homeAddress: demographics[3],
      };

      const formattedImmunizations = immunizations.map(immunization => ({
        vaccine: immunization.vaccine,
        administeredDate: immunization.administeredDate,
      }));

      const formattedInsurance = {
        provider: insurance[0],
        policyNumber: insurance[1],
        coverageDetails: insurance[2],
        coverageLimit: insurance[3].toString(),
        effectiveDateStart: insurance[4],
        effectiveDateEnd: insurance[5],
        contactInfo: insurance[6],
      };

      const formattedMedicalConditions = medicalConditions.map(condition => ({
        condition: condition.condition,
        diagnosisDate: condition.diagnosisDate,
      }));

      const formattedMedications = medications.map(medication => ({
        medicationName: medication.medicationName,
        dosage: medication.dosage,
        startDate: medication.startDate,
        endDate: medication.endDate,
      }));

      const formattedMentalHealth = mentalHealth.map(diagnosis => ({
        mentalHealthDiagnosis: diagnosis.mentalHealthDiagnosis,
        dateDiagnosed: diagnosis.dateDiagnosed,
      }));

      const formattedSurgeries = surgeries.map(surgery => ({
        surgeryType: surgery.surgeryType,
        surgeryDate: surgery.surgeryDate,
      }));

      const patientData = {
        allergies: formattedAllergies,
        demographics: formattedDemographics,
        immunizations: formattedImmunizations,
        insurance: formattedInsurance,
        medicalConditions: formattedMedicalConditions,
        medications: formattedMedications,
        mentalHealth: formattedMentalHealth,
        surgeries: formattedSurgeries,
      };

      setPatientData(patientData);
      console.log('Patient data response:', patientData);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const renderPatientDataJSON = () => {
    return <pre>{JSON.stringify(patientData, null, 2)}</pre>;
  };

  const handleaRevokeReadAccess = async () => {
    try {
      //console.log('granting read access to :', providerAddress, 'from:', account)
      //const permissionCheck = contractInstance.methods.hasReadPermission(account,providerAddress).call()
      const allergies = await allergyInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const dem = await demographyInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000,  gasPrice:20000000000});
      const imm = await immunizationInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const ins = await await insuranceInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const medC = await medicalConditionInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const meds = await medicationInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const mental = await mentalInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const surgery = await surgeryInstance.methods.revokeReadAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});

      const tx = {
        allergies,
        dem,
        imm,
        ins,
        medC,
        meds,
        mental,
        surgery
      }
      
      
      alert(tx)
      
      console.log("Access revoked", tx ) 
    } catch (error) {
      console.error('Error revoking read access:', error);
      alert('Failed to revoke read access');
    }
  };

  const handleaRevokeUpdateAccess = async () => {
    try {
      //console.log('granting read access to :', providerAddress, 'from:', account)
      //const permissionCheck = contractInstance.methods.hasReadPermission(account,providerAddress).call()
      const allergies = await allergyInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const dem = await demographyInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000,  gasPrice:20000000000});
      const imm = await immunizationInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const ins = await await insuranceInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const medC = await medicalConditionInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const meds = await medicationInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const mental = await mentalInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});
      const surgery = await surgeryInstance.methods.revokeUpdateAccess(account,providerAddress).send({from:account, gas: 3000000, gasPrice:20000000000});

      const tx = {
        allergies,
        dem,
        imm,
        ins,
        medC,
        meds,
        mental,
        surgery
      }
      
      
      alert(tx)
      
      console.log("Access revoked", tx ) 
    } catch (error) {
      console.error('Error revoking read access:', error);
      alert('Failed to revoke read access');
    }
  };


  return (
    <div>
      <h1>Welcome to MediChain Patient Dashboard {data.userID}</h1>
      <div>
        <p>Your connected MetaMask account: {account}</p>
        
      </div>
      <div>
        <label htmlFor='providerAddress'>Provider Wallet Address: </label>
        <input
          type='text'
          id='providerAddress'
          value={providerAddress}
          onChange={(e) => setProviderAddress(e.target.value)}
          placeholder="Enter provider's wallet address"
        />
      </div>
      
      <button onClick={connectMetaMask}>Connect to MetaMask</button>
      <button onClick={handleGrantReadAccess}>Grant Read Access</button>
      <button onClick={handleaRevokeReadAccess}>Revoke Read Access</button>
      <button onClick={handleGrantUpdateAccess}>Grant Update Access</button>
      <button onClick={handleaRevokeUpdateAccess}>Revoke Update Access</button>
      <button onClick={handleRead}>See your medical history</button>
      <button onClick={handleClick}>Log Out</button>

      {mode === 'read' && (
        <div>
          <h2>Reading Patient Data</h2>
          {renderPatientDataJSON()}
        </div>
      )}
    </div>
     
      
  );
      };

export default PatientDash;
