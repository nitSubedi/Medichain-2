import React, { useContext, useState } from 'react'
import { Form, redirect, useActionData, useNavigation, Link } from 'react-router-dom'
import { RoleContext } from '../utils/ThemeRole'
import { loginUser } from '../utils/api'


export async function loginAction({ request }) {
  const formData = await request.formData()
  const userID = formData.get("userID")
  const password = formData.get("password")
  const role = formData.get("role")
  
  try {
    const res = await loginUser({ userID, password, role })
    if (res.ok) {
      console.log(res)
      if (role === 'patient') {
        return redirect('/patientDash');
      }else if(role === 'healthcare_provider'){
        return redirect('/hcpDash');
      }
      // Add additional role checks and redirects as needed
    } else {
      // Handle the case where the login response is not OK
      // You might want to return an error message or redirect to an error page
      return { error: 'Login failed' };
    }
  }
  catch (err) {
    return {error: err.message }
  }
}
function Login() {
  const {role, setRole} = useContext(RoleContext);
  const navigation = useNavigation()
  const message = useActionData()
  const [loginFormData, setLoginFormData] = useState({ userID: "", password: "", role: role ?? "" })
 

  function handleChange(e) {
    const { name, value } = e.target
    setLoginFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'role') {
      setRole(value); // Update the role in the context
    }
  }

console.log(loginFormData)
  return (
    <div className='login-container'>
      {role}
      <h1>Sign in to your account</h1>
      <Form method="post" className="login-form">
        <input
          name="userID"
          type='text'
          placeholder='Username'
          value={loginFormData.email}
          onChange={handleChange}
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={loginFormData.password}
          onChange={handleChange}
        />


        <div>
          Select Your Role:   
          <label>
            Patient
            <input
              name='role'
              type='radio'
              value="patient"
              checked = {loginFormData.role === 'patient'}
              onChange={handleChange}
            />
          </label>
          <label>
            HealthCare Provider
            <input
              name='role'
              type='radio'
              value="healthcare_provider"
              checked = {loginFormData.role === 'healthcare_provider'}
              onChange={handleChange}
            />
          </label>
        </div>

        

        <button disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Logging In....." : "Log In"}
        </button>
      </Form>
      {message && <h1>{message.error || message}</h1>}
      <Link to='/signup'>Create an Account</Link>
    </div>
  )
}

export default Login