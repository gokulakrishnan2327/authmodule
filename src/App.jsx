import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';

// Layouts
import AuthLayout from '../src/layouts/AuthLayout';

// Auth Pages
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import CheckYourMailPage from './features/auth/pages/CheckYourMailPage';
import ResetPassword from './features/auth/pages/ResetPassword';
import OnboardingPage from './features/auth/pages/OnboardingPage';
import EmailVerification from './components/EmailVerification';
import StartRegisterPage from './features/auth/pages/StartRegisterPage';
import OAuthCallback from './features/auth/OAuthCallback';

// Dashboard Pages
import DashboardPage from './features/dashboard/page/DashboardPage';

// Route Protection Components
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import StartLoginPage from './features/auth/pages/StartLoginPage';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Try to get current user on app load if token exists
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        {/* Default route redirects to start registration */}
        <Route path="/" element={<Navigate to="/auth/register" replace />} />
        
        <Route path="/auth">
          <Route path="register" element={<StartRegisterPage />} />
          <Route path="start-login" element={<StartLoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="check-mail" element={<CheckYourMailPage />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email" element={<EmailVerification />} />
          <Route path="/auth/:provider/callback" element={<OAuthCallback />} />

        </Route>
      </Route>
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/auth/register" replace />} />
    </Routes>
  );
};

export default App;