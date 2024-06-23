import React, {useState, useEffect} from 'react'
import { useLoaderData, useNavigate, redirect, json } from 'react-router-dom'
import { getUserData } from '../../utils/api'
import { requestAccount, getContract } from '../../utils/blockchain';
import {contractAddresses, contractABIs} from '../../utils/contracts'
import { grantReadAccess } from '../../utils/AccessControl';


export async function loader(){
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/login'); // Redirect if no token
  }
  const res = await getUserData();
   return json(res.data)
}

function PatientDash() {
  const navigate = useNavigate()
  const data = useLoaderData()
  

  //States
  const [address, setAddress] = useState({patient: "", provider: ""})
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [providerAddress, setProviderAddress] = useState('');


  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await requestAccount();
        if (accounts.length === 0) {
          throw new Error('No accounts found');
        }
        const account = accounts[0];
        setAccounts(account);
        
        console.log(accounts)

         // Using the accessControl contract details from contracts.js
         const contractAddress = contractAddresses.accessControl;
         const contractABI = contractABIs.accessControl;
         const contract = getContract(contractAddress, contractABI);
         setContract(contract);

     
       } catch (error) {
         console.error('Error initializing ether:', error);
       }
     };
     init();
  }, [data.walletAddress]);
 
  

  async function handleGrantAccess(){
    try {
      await grantReadAccess(contract, address.patient, address.provider);

      alert('Read access granted!');
    } catch (error) {
      console.error('Error granting read access:', error);
    }
  }

  function handleChange(e) {
    const {name, value} = e.target
    
   setAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleClick() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole');
    navigate('/login');
  }
  console.log(address)
  return (
    <div>
      <h1>Welcome to MediChain Patient Dashboard</h1>
      <div>
       <p>Your wallet address is {data.walletAddress}</p>
       User Information
       <br />
       <pre>{JSON.stringify(data)}</pre>
      </div>
      <input
          name="patient"
          type='text'
          placeholder='Patient Address'
          value={address.patient}
          onChange={handleChange}
        />
      <input
          name="provider"
          type='text'
          placeholder='Provider Address'
          value={address.provider}
          onChange={handleChange}
        />

      <button onClick={handleGrantAccess}>Grant Read Access</button>
      <button onClick={handleClick}>Log Out</button>
    </div>

  )
}

export default PatientDash