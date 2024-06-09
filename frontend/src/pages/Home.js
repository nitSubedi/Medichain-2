import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import { RoleContext } from '../utils/ThemeRole';


function Home() {

  const {role, setRole} = useContext(RoleContext)
    
  return (
    <div>
        <div>This is Home Page</div>
        <h1>{role}</h1>
        <button onClick={() => setRole("Patient")}>Patient</button>
        <button onClick={() => setRole("Doctor")}> Doctor</button>
        <Link to='/login'> Go to Login Page</Link>
    </div>
    
  )
}

export default Home