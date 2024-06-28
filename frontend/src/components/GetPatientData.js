import React, { useState, useEffect } from 'react';
import { getPatientData } from '../utils/api';

const GetPatientData = ({ patientAddress, providerAddress }) => {
    const [patientData, setPatientData] = useState({});
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getPatientData(patientAddress);
          setPatientData(res.data);
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      };
  
      fetchData();
    }, [patientAddress, providerAddress]);
  
    return (
      <div>
        <h2>Patient Data for {patientAddress}</h2>
        <pre>{JSON.stringify(patientData, null, 2)}</pre>
      </div>
    );
  };
  
  export default GetPatientData;