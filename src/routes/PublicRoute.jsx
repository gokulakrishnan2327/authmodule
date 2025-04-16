// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const { isAuthenticated, profileStatus } = useSelector((state) => state.auth);
  const location = useLocation();

  // If user is logged in, redirect them based on their profile status
  if (isAuthenticated) {
    // Get the intended destination from query params or use default routes
    const from = location.state?.from?.pathname || 
      (profileStatus === 'complete' ? '/dashboard' : '/onboarding');
    
    return <Navigate to={from} replace />;
    
  }
  console.log('Authenticated:', isAuthenticated);
  console.log('Token:', localStorage.getItem('token'));
  
  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;