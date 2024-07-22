import React, { useContext, useState } from 'react'
import { Form, useNavigation, redirect, useActionData, Link } from 'react-router-dom'
import { RoleContext } from '../utils/ThemeRole'
import { signupUser } from '../utils/api';


export async function signupAction({ request }) {
  const formData = await request.formData()
  const userID = formData.get("userID");
  const password = formData.get("password")
  const role = formData.get("role")
  const phoneNumber = formData.get("phoneNumber")

  try {
    const res = await signupUser({ userID, password, role, phoneNumber })
    if (res.ok) {
      console.log("Working up here")
      return redirect('/login')
      // Add additional role checks and redirects as needed
    } else {
      // Handle the case where the signup is not OK
      // You might want to return an error message or redirect to an error page
      return { error: 'Signup failed' };
    }
  }
  catch (err) {
    return { error: err.message }
  }
}


function Signup() {
  const { role, setRole } = useContext(RoleContext);
  const navigation = useNavigation();
  const [signupFormData, setsignupFormData] = useState({ userID: "", password: "", role: role ?? "", phoneNumber: "" });
  const actionData = useActionData();

  function handleChange(e) {
    const { name, value } = e.target
    setsignupFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'role') {
      setRole(value); // Update the role in the context
    }
  }
  console.log(signupFormData)
  console.log(actionData)
  return (
    <div className='signup-container'>
      <Link to='/login'>Back to Login</Link>
      <h1>Create an Account</h1>
      <Form method='post' className='signup-form'>
        <input
          name="userID"
          type='text'
          placeholder='Username'
          value={signupFormData.userID}
          onChange={handleChange}
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={signupFormData.password}
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
              checked={signupFormData.role === 'patient'}
              onChange={handleChange}
            />
          </label>
          <label>
            HealthCare Provider
            <input
              name='role'
              type='radio'
              value="healthcare_provider"
              checked={signupFormData.role === 'healthcare_provider'}
              onChange={handleChange}
            />
          </label>
        </div>
        <input
          name='phoneNumber'
          type='tel'
          placeholder='Phone Number'
          value={signupFormData.phoneNumber}
          onChange={handleChange}
        />
        {actionData && actionData.error && <h1 style={{ color: 'red' }}>{actionData.error}</h1>}
        <button disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Signing up" : "Sign up"}
        </button>
      </Form>

    </div>
  )
}

export default Signup