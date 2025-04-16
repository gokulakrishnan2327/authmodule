import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import OnboardingPage from '../features/auth/pages/OnboardingPage';
import EmailVerification from '../components/EmailVerification';
import StartRegisterPage from '../features/auth/pages/StartRegisterPage'; 

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AuthRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - accessible when not logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/register" element={<StartRegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        {/* Email verification should be accessible without authentication */}
        <Route path="/auth/verify-email" element={<EmailVerification />} />
      </Route>
      
      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      
      {/* Redirect any other auth paths to login */}
      <Route path="/auth/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;