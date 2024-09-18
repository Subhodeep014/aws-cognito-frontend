import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
export default function PrivateRoute() {
    const {currentUser} = useSelector(state=>state.user);
    const navigate = useNavigate();
  return (
    currentUser ? <Outlet/> : <Navigate to="/signin"/>
  )
}
