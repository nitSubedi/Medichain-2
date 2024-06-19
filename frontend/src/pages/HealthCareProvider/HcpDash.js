import React from 'react'
import { useNavigate, redirect, json, useLoaderData } from 'react-router-dom';
import { getUserData } from '../../utils/api';

export async function loader() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/login'); // Redirect if no token
  }
  const res = await getUserData();

  return json(res.data)
}

function HcpDash() {
  const navigate = useNavigate()
  const data = useLoaderData();
  function handleClick() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole');
    navigate('/login');
  }
  return (
    <div>
      <h1>HealthCare Provider Dash</h1>
      <p>Your wallet adddress is {data.walletAddress}</p>
      <pre>{JSON.stringify(data)}</pre>
      <button onClick={handleClick}>Log Out</button>
    </div>

  )
}

export default HcpDash