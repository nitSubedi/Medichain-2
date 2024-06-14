import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import { RoleContext } from '../utils/ThemeRole';


function Home() {

  const {role, setRole} = useContext(RoleContext)
    
  return (
    <div>
        <div>This is Home Page</div>
        <h1>{role}</h1>
        <button onClick={() => setRole("patient")}>Patient</button>
        <button onClick={() => setRole("healthcare_provider")}> Health Care Provider</button>
        <Link to='/login'> Go to Login Page</Link>
        <br/>
        <Link to='/signup'>Create an Account</Link>
      
    </div>
    
  )
}

export default Home