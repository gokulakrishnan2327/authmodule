// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';

// Layouts
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import OnboardingPage from './features/auth/pages/OnboardingPage';
import EmailVerification from './components/EmailVerification';

// Dashboard Pages
import DashboardPage from './features/dashboard/page/DashboardPage';

// Route Protection Components
import ProtectedRoute from './routes/ProtectedRoute';
import  PublicRoute  from './routes/PublicRoute';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Try to get current user on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        <Route >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-email" element={<EmailVerification />} />
        </Route>
      </Route>
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;