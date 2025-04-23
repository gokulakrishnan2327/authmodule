import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Define the state structure for Redux (similar to PublicRoute)
interface AuthState {
  isAuthenticated: boolean;
  emailVerified: boolean;
  profileStatus: 'complete' | 'incomplete';
}

interface RootState {
  auth: AuthState;
}

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, emailVerified, profileStatus } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // If email not verified, redirect to email verification
  if (!emailVerified) {
    return <Navigate to="/auth/verify-email" state={{ from: location }} replace />;
  }
  
  // Special case for onboarding
  if (location.pathname === '/onboarding' && profileStatus === 'complete') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If profile not complete and not on onboarding page, redirect to onboarding
  if (profileStatus !== 'complete' && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // All checks passed, render the requested route
  return <Outlet />;
};

export default ProtectedRoute;