import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const { isAuthenticated, emailVerified, profileStatus } = useSelector((state) => state.auth);
  const location = useLocation();
  const currentPath = location.pathname;

  // Special case for email verification - don't redirect if user is at verification page
  if (currentPath === '/auth/verify-email') {
    // If user is fully authenticated with verified email and complete profile, 
    // redirect to dashboard (they don't need to verify again)
    if (isAuthenticated && emailVerified && profileStatus === 'complete') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Otherwise, just show the verification page
    return <Outlet />;
  }

  // For all other public routes
  if (isAuthenticated) {
    // If authenticated but email not verified, redirect to email verification
    if (!emailVerified) {
      return <Navigate to="/auth/verify-email" replace />;
    }
    
    // If authenticated and email verified but profile incomplete, redirect to onboarding
    if (emailVerified && profileStatus === 'incomplete') {
      return <Navigate to="/onboarding" replace />;
    }
    
    // If authenticated with verified email and complete profile, redirect to dashboard
    // or the intended destination
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  
  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;