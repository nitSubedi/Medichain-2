import React from 'react'
import { useLoaderData, useNavigate, redirect, json } from 'react-router-dom'
import { getUserData } from '../../utils/api'


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
  
 

  console.log(data)
  function handleClick() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole');
    navigate('/login');
  }
  return (
    <div>
      <h1>Welcome to MediChain Patient Dashboard</h1>
      <div>
       <p>Your wallet address is {data.walletAddress}</p>
       User Information
       <br />
       <pre>{JSON.stringify(data)}</pre>
      </div>
      <button onClick={handleClick}>Log Out</button>
    </div>

  )
}

export default PatientDash