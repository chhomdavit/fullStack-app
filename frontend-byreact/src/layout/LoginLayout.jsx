import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
  document.title = "Login";
  return (
    <div> 
      <Outlet/>
    </div>
  )
}

export default LoginLayout
