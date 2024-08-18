import React, { useState, useEffect } from 'react';
import { useNavigate, redirect, json, useLoaderData } from 'react-router-dom';
import { getUserData } from '../../utils/api';
import { addProviderorPatient } from '../../utils/api';
import { contractABIs, contractAddresses } from '../../utils/contracts';
import Web3 from 'web3';
import '../../index.css';
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
  const [newData, setNewData] = useState([]);
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
      const allergies = await allergyInstance.methods.getAllergies(patientAddress).call({from: account, gas: 3000000});
      const demographics = await demographyInstance.methods.getDemographics(patientAddress).call({ from: account, gas: 3000000 });
      const immunizations = await immunizationInstance.methods.getImmunization(patientAddress).call({ from: account, gas: 3000000});
      const insurance = await insuranceInstance.methods.getInsurance(patientAddress).call({ from: account, gas: 3000000});
      const medicalConditions = await medicalConditionInstance.methods.getMedicalCondition(patientAddress).call({ from: account, gas: 3000000});
      const medications = await medicationInstance.methods.getMedication(patientAddress).call({ from: account, gas: 3000000});
      const mentalHealth = await mentalInstance.methods.getDiagnosis(patientAddress).call({ from: account, gas: 3000000 });
      const surgeries = await surgeryInstance.methods.getSurgery(patientAddress).call({ from: account, gas: 3000000 });

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

  //const addressData = {data.userID, patientAddress};
  //const handleNewAddresses = async()=>{
  

  const handleUpdate = () => {
    console.log('Update mode selected');
    setMode('update');
  };

  const handleFieldSelect = (e) => {
    setSelectedField(e.target.value);
    setNewData([]);
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

  const fieldStructures = {
    allergies: ['Allergy'],
    demographics: ['Name', 'Date of Birth', 'Gender', 'Home Address'],
    immunizations: ['Vaccine', 'Administered Date'],
    insurance: [
      'Provider',
      'Policy Number',
      'Coverage Details',
      'Coverage Limit',
      'Effective Date Start',
      'Effective Date End',
      'Contact Info',
    ],
    medicalConditions: ['Condition', 'Diagnosis Date'],
    medications: [
      'Medication Name',
      'Dosage',
      'Start Date',
      'End Date'
    ],
    mentalHealth: ['Mental Health Diagnosis', 'Date Diagnosed'],
    surgeries: ['Surgery Type', 'Surgery Date'],
  };



  const renderUpdateFields = () => {
    switch (selectedField) {
      case 'allergies':
        return (
          <div>
            <input
              type="text"
              placeholder="New Allergy"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value])}
            />
          </div>
        );
      case 'demographics':
        return (
          <div>
            <input
              type="text"
              placeholder="Name"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1], newData[2], newData[3]])}
            />
            <input
              type="text"
              placeholder="Date of Birth"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value, newData[2], newData[3]])}
            />
            <input
              type="text"
              placeholder="Gender"
              value={newData[2] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], e.target.value, newData[3]])}
            />
            <input
              type="text"
              placeholder="Home Address"
              value={newData[3] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], e.target.value])}
            />
          </div>
        );
      case 'immunizations':
        return (
          <div>
            <input
              type="text"
              placeholder="Vaccine"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1]])}
            />
            <input
              type="text"
              placeholder="Administered Date"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value])}
            />
          </div>
        );
      case 'insurance':
        return (
          <div>
            <input
              type="text"
              placeholder="Provider"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1], newData[2], newData[3], newData[4], newData[5], newData[6]])}
            />
            <input
              type="text"
              placeholder="Policy Number"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value, newData[2], newData[3], newData[4], newData[5], newData[6]])}
            />
            <input
              type="text"
              placeholder="Coverage Details"
              value={newData[2] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], e.target.value, newData[3], newData[4], newData[5], newData[6]])}
            />
            <input
              type="text"
              placeholder="Coverage Limit"
              value={newData[3] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], e.target.value, newData[4], newData[5], newData[6]])}
            />
            <input
              type="text"
              placeholder="Effective Date Start"
              value={newData[4] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], newData[3], e.target.value, newData[5], newData[6]])}
            />
            <input
              type="text"
              placeholder="Effective Date End"
              value={newData[5] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], newData[3], newData[4], e.target.value, newData[6]])}
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={newData[6] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], newData[3], newData[4], newData[5], e.target.value])}
            />
          </div>
        );
      case 'medicalConditions':
        return (
          <div>
            <input
              type="text"
              placeholder="Condition"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1]])}
            />
            <input
              type="text"
              placeholder="Diagnosis Date"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value])}
            />
          </div>
        );
      case 'medications':
        return (
          <div>
            <input
              type="text"
              placeholder="Medication Name"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1], newData[2], newData[3]])}
            />
            <input
              type="text"
              placeholder="Dosage"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value, newData[2], newData[3]])}
            />
            <input
              type="text"
              placeholder="Start Date"
              value={newData[2] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], e.target.value, newData[3]])}
            />
            <input
              type="text"
              placeholder="End Date"
              value={newData[3] || ''}
              onChange={(e) => setNewData([newData[0], newData[1], newData[2], e.target.value])}
            />
          </div>
        );
      case 'mentalHealth':
        return (
          <div>
            <input
              type="text"
              placeholder="Mental Health Diagnosis"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1]])}
            />
            <input
              type="text"
              placeholder="Date Diagnosed"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value])}
            />
          </div>
        );
      case 'surgeries':
        return (
          <div>
            <input
              type="text"
              placeholder="Surgery Type"
              value={newData[0] || ''}
              onChange={(e) => setNewData([e.target.value, newData[1]])}
            />
            <input
              type="text"
              placeholder="Surgery Date"
              value={newData[1] || ''}
              onChange={(e) => setNewData([newData[0], e.target.value])}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
      <div className="hdashboard-container">
        <h1>Welcome to MediChain, {data.userID}!</h1>
        <div>
          <p>Your connected MetaMask account: {account}</p>
          <button onClick={connectMetaMask} className='connect'>Connect to MetaMask</button>
        </div>
        <div>
          <label htmlFor='patientAddress'>Patient Wallet Address</label>
          <input
            type="text"
            placeholder="Patient Address"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
          />
        </div>
        <div className='button-group'> 
          <button onClick={handleRead}>Read Patient Data</button>
          <button onClick={handleUpdate}>Update Patient Data</button>
          <button className='logout-button' onClick={handleClick}>Log Out</button>
        </div>
       
        {mode === 'read' && (
          <div className='patient-data'>
            <h2>Patient Data</h2>
            {renderPatientDataJSON()}
          </div>
        )}
        {mode === 'update' && (
          <div>
            <h2>Update Patient Data</h2>
            <select value={selectedField} onChange={handleFieldSelect}>
              <option value="">Select Field</option>
              {Object.keys(fieldStructures).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            {renderUpdateFields()}
            <button onClick={handleUpdatePatientData}>Submit</button>
          </div>
        )}
      </div>
    );
}


export default HcpDash;
