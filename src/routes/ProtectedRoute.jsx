import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, emailVerified } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated but email not verified, redirect to email verification
  if (isAuthenticated && !emailVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // If authenticated and email verified, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;