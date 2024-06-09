import React from 'react'
import { useContext } from 'react'
import { RoleContext } from '../utils/ThemeRole'

function Login() {
  const {role} = useContext(RoleContext)
  return (
    <div>
      {role}
      <h1>Login Page</h1>
    </div>
  )
}

export default Login