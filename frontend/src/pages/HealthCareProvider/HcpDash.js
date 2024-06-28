import React, { useState } from 'react';
import { useNavigate, redirect, json, useLoaderData } from 'react-router-dom';
import { getUserData, getPatientData, updatePatientData } from '../../utils/api';
import GetPatientData from '../../components/GetPatientData';
import UpdatePatientData from '../../components/UpdatePatientData';

export async function loader() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/login'); // Redirect if no token
  }
  const res = await getUserData();

  if (res.error) {
    console.error('Error loading user data:', res.error);
    return redirect('/login'); // Redirect to login on error
  }

  return json(res.data);
}

function HcpDash() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const providerAddress = data.walletAddress;

  const [patientAddress, setPatientAddress] = useState('');
  const [mode, setMode] = useState(null); // Added state for mode
  const [selectedField, setSelectedField] = useState(''); // Added state for selected field
  const [patientData, setPatientData] = useState({});
  const [newData, setNewData] = useState('');

  const handlePatientAddressChange = (e) => {
    setPatientAddress(e.target.value);
  };

  const handleClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleRead = async () => {
    console.log('Read mode selected');
    setMode('read');
    try {
      const res = await getPatientData(patientAddress);
      setPatientData(res.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleUpdate = () => {
    console.log('Update mode selected');
    setMode('update');
  };

  const handleFieldSelect = (e) => {
    console.log(`Field selected: ${e.target.value}`);
    setSelectedField(e.target.value);
  };

  const handleUpdatePatientData = async () => {
    try {
      const res = await updatePatientData(patientAddress, selectedField, newData);
      alert(res.data.message);
    } catch (error) {
      console.error('Error updating patient data:', error);
      alert('Failed to update patient data');
    }
  };

  const renderPatientDataJSON = () => {
    return <pre>{JSON.stringify(patientData, null, 2)}</pre>;
  };

  return (
    <div>
      <h1>HealthCare Provider Dash</h1>
      <p>Your wallet address is {data.walletAddress}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <label htmlFor='patientAddress'>Patient Wallet Address: </label>
        <input
          type='text'
          id='patientAddress'
          value={patientAddress}
          onChange={handlePatientAddressChange}
          placeholder="Enter patient's wallet address"
        />
      </div>
      <div>
        <button onClick={handleRead}>Read</button>
        <button onClick={handleUpdate}>Update</button>
      </div>

      {mode === 'read' && (
        <div>
          <h2>Reading Patient Data</h2>
          {renderPatientDataJSON()}
          <GetPatientData patientAddress={patientAddress} providerAddress={providerAddress} />
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
              <input
                type='text'
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                placeholder={`Enter new ${selectedField} data`}
              />
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
