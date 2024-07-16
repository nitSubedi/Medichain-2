import React, { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, json, redirect } from 'react-router-dom';
import { grantReadAccess, grantUpdateAccess } from '../../utils/AccessControl'; // Ensure this path is correct
import { getUserData } from '../../utils/api'; // Ensure this path is correct
import { contractABIs, contractAddresses} from "../../utils/contracts";
import {Web3} from "web3";
// Initialize Web3
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

  return (
    <div>
      <h1>Welcome to MediChain Patient Dashboard</h1>
      <div>
        <p>Your connected MetaMask account: {account}</p>
        <p>Your wallet address is {data.walletAddress}</p>
        User Information
        <br />
        <pre>{JSON.stringify(data, null, 2)}</pre>
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
      <button onClick={handleGrantUpdateAccess}>Grant Update Access</button>
      <button onClick={handleClick}>Log Out</button>
    </div>
  );
}

export default PatientDash;
