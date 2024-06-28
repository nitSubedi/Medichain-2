import React, { useState } from 'react';
import { updatePatientData } from '../utils/api';

const UpdatePatientData = ({ patientAddress, providerAddress, contractName, fieldName }) => {
  const [newData, setNewData] = useState('');

  const handleUpdate = async () => {
    try {
      const res = await updatePatientData(patientAddress, contractName, newData);
      alert(res.data.message);
    } catch (error) {
      console.error('Error updating patient data:', error);
      alert('Failed to update patient data');
    }
  };

  return (
    <div>
      <h3>Update {fieldName} in {contractName}</h3>
      <input
        type='text'
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
        placeholder={`Enter new ${fieldName} data`}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdatePatientData;
