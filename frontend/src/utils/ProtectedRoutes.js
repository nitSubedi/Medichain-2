import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes({children, requiredRole}) {
 const token = localStorage.getItem('authToken')
 const userRole = localStorage.getItem('userRole')

 if(!token || userRole!== requiredRole ){
    return <Navigate to='/login' />
 }
 return children;
}

export default ProtectedRoutes