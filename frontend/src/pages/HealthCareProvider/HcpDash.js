import React, { useState, useEffect } from 'react';
import { useNavigate, redirect, json, useLoaderData } from 'react-router-dom';
import { getUserData } from '../../utils/api';
import { contractABIs, contractAddresses } from '../../utils/contracts';
import Web3 from 'web3';

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  console.error('MetaMask not detected. Please install MetaMask and reload the page.');
}

export async function loader() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/login');
  }
  const res = await getUserData();
  return json(res.data);
}

function HcpDash() {
  const navigate = useNavigate();
  const data = useLoaderData();

  const [patientAddress, setPatientAddress] = useState('');
  const [mode, setMode] = useState(null);
  const [selectedField, setSelectedField] = useState('');
  const [patientData, setPatientData] = useState('');
  const [newData, setNewData] = useState('');
  const [account, setAccount] = useState('');

  
  useEffect(() => {
    if (window.ethereum && account === '') {
      connectMetaMask();
    }
  }, [account]);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
  };

  useEffect(() => {
    connectMetaMask();
  }, []);

  const handleClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const allergyInstance = new web3.eth.Contract(contractABIs.allergies, contractAddresses.allergies);
  const demographyInstance = new web3.eth.Contract(contractABIs.demographics, contractAddresses.demographics);
  const immunizationInstance = new web3.eth.Contract(contractABIs.immunization, contractAddresses.immunization);
  const insuranceInstance = new web3.eth.Contract(contractABIs.insurance, contractAddresses.insurance);
  const medicalConditionInstance = new web3.eth.Contract(contractABIs.medicalConditions, contractAddresses.medicalConditions);
  const medicationInstance = new web3.eth.Contract(contractABIs.medications, contractAddresses.medications);
  const mentalInstance = new web3.eth.Contract(contractABIs.mentalHealth, contractAddresses.mentalHealth);
  const surgeryInstance = new web3.eth.Contract(contractABIs.surgeries, contractAddresses.surgeries);
  const contractInstance = new web3.eth.Contract(contractABIs.accessControl, contractAddresses.accessControl);


  const handleRead = async () => {
    console.log('Read mode selected');
    setMode('read');
    try {
      
      console.log('getting data for patient :', patientAddress, 'from:', account);
      const allergies = await allergyInstance.methods.getAllergies(patientAddress).call();
      const demographics = await demographyInstance.methods.getDemographics(patientAddress).call({ from: account });
      const immunizations = await immunizationInstance.methods.getImmunization(patientAddress).call({ from: account});
      const insurance = await insuranceInstance.methods.getInsurance(patientAddress).call({ from: account});
      const medicalConditions = await medicalConditionInstance.methods.getMedicalCondition(patientAddress).call({ from: account});
      const medications = await medicationInstance.methods.getMedication(patientAddress).call({ from: account});
      const mentalHealth = await mentalInstance.methods.getDiagnosis(patientAddress).call({ from: account });
      const surgeries = await surgeryInstance.methods.getSurgery(patientAddress).call({ from: account });

      const convertBigIntToString = (data) => {
        if (typeof data === 'bigint') return data.toString();
        if (Array.isArray(data)) return data.map(convertBigIntToString);
        if (data && typeof data === 'object') {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, convertBigIntToString(value)])
          );
        }
        return data;
      };

      const patientData = {
        allergies: convertBigIntToString(allergies),
        demographics: convertBigIntToString(demographics),
        immunizations: convertBigIntToString(immunizations),
        insurance: convertBigIntToString(insurance),
        medicalConditions: convertBigIntToString(medicalConditions),
        medications: convertBigIntToString(medications),
        mentalHealth: convertBigIntToString(mentalHealth),
        surgeries: convertBigIntToString(surgeries),
      };

      setPatientData(patientData);
      console.log('Patient data response:', patientData);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleUpdate = () => {
    console.log('Update mode selected');
    setMode('update');
  };

  const handleFieldSelect = (e) => {
    setSelectedField(e.target.value);
  };

  const handleUpdatePatientData = async () => {
    try {
      
      console.log('Adding data for patient:', patientAddress, 'from provider:', account);
      let results;
      
      switch (selectedField) {
        case 'allergies':
          const allergy = newData[0];
          results = await allergyInstance.methods.addAllergy(patientAddress,allergy).send({from: account, gas: 3000000, gasPrice:20000000000});
          break;
          
        case 'demographics':
          const [name, dateOfBirth, gender, homeAddress] = newData;
          results = await demographyInstance.methods.setDemographics(patientAddress, name, dateOfBirth, gender, homeAddress).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'immunizations':
          const [vaccine, administeredDate] = newData;
          results = await immunizationInstance.methods.addImmunization(patientAddress, vaccine, administeredDate).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'insurance':
          const [provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo] = newData;
          results = await insuranceInstance.methods.setInsurance(patientAddress, provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'medicalConditions':
          const [conditions, diagnosisDate] = newData;
          results = await medicalConditionInstance.methods.addMedicalCondition(patientAddress, conditions, diagnosisDate).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'medications':
          const [medicationName, dosage, startDate, endDate] = newData;
          results = await medicationInstance.methods.addMedication(patientAddress, medicationName, dosage, startDate, endDate).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'mentalHealth':
          const [mentalHealthDiagnosis, dateDiagnosed] = newData;
          results = await mentalInstance.methods.addDiagnosis(patientAddress, mentalHealthDiagnosis, dateDiagnosed).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        case 'surgeries':
          const [surgeryType, surgeryDate] = newData;
          results = await surgeryInstance.methods.addSurgery(patientAddress, surgeryType, surgeryDate).send({ from: account, gas: 3000000, gasPrice:20000000000 });
          break;
          
        default:
          console.log("Contract name not found");
          return;
      }
      
      console.log("Successfully added/updated patient data", results);
      alert('Patient data updated successfully');
      
    } catch (error) {
      console.error('Error updating patient data:', error);
      alert('Failed to update patient data');
    }
  };

  const renderPatientDataJSON = () => {
    return <pre>{JSON.stringify(patientData, null, 2)}</pre>;
  };

  const renderUpdateFields = () => {
    switch (selectedField) {
      case 'allergies':
        return (
          <input
            type="text"
            placeholder="New Allergy"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'demographics':
        return (
          <input
            type="text"
            placeholder="Name, DOB, Gender, Address"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'immunizations':
        return (
          <input
            type="text"
            placeholder="Vaccine, Administered Date"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'insurance':
        return (
          <input
            type="text"
            placeholder="Provider, Policy Number, Coverage Details, Coverage Limit, Effective Date Start, Effective Date End, Contact Info"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'medicalConditions':
        return (
          <input
            type="text"
            placeholder="Condition, Diagnosis Date"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'medications':
        return (
          <input
            type="text"
            placeholder="Medication Name, Dosage, Start Date, End Date"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'mentalHealth':
        return (
          <input
            type="text"
            placeholder="Mental Health Diagnosis, Date Diagnosed"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      case 'surgeries':
        return (
          <input
            type="text"
            placeholder="Surgery Type, Surgery Date"
            value={newData}
            onChange={(e) => setNewData(e.target.value.split(','))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>HealthCare Provider Dashboard</h1>
      <p>Your connected MetaMask account: {account}</p>
      <p>Your wallet address is {data.walletAddress}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <label htmlFor="patientAddress">Patient Wallet Address: </label>
        <input
          type="text"
          id="patientAddress"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          placeholder="Enter patient's wallet address"
        />
      </div>
      <div>
        <button onClick={connectMetaMask}>Connect to MetaMask</button>
        <button onClick={handleRead}>Read</button>
        <button onClick={handleUpdate}>Update</button>
      </div>

      {mode === 'read' && (
        <div>
          <h2>Reading Patient Data</h2>
          {renderPatientDataJSON()}
        </div>
      )}

      {mode === 'update' && (
        <div>
          <h2>Select Field to Update</h2>
          <select value={selectedField} onChange={handleFieldSelect}>
            <option value="">Select a field</option>
            <option value="allergies">Allergies</option>
            <option value="demographics">Demographics</option>
            <option value="immunizations">Immunizations</option>
            <option value="insurance">Insurance</option>
            <option value="medicalConditions">Medical Conditions</option>
            <option value="medications">Medications</option>
            <option value="mentalHealth">Mental Health</option>
            <option value="surgeries">Surgeries</option>
          </select>

          {selectedField && (
            <div>
              <h3>Updating {selectedField}</h3>
              {renderUpdateFields()}
              <button onClick={handleUpdatePatientData}>Update</button>
            </div>
          )}
        </div>
      )}

      <button onClick={handleClick}>Log Out</button>
    </div>
  );
}

export default HcpDash;
