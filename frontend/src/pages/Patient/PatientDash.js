import React from 'react'
import { useNavigate } from 'react-router-dom'

function PatientDash() {
  const navigate = useNavigate()
  function handleClick(){
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole');
    navigate('/login');
  }
  return (
    <div>
      <h1>Patient Dash</h1>
      <button onClick={handleClick}>Log Out</button>
    </div>

  )
}

export default PatientDash