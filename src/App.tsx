import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import { RootState, AppDispatch } from '../src/redux/types'; // You'll need to create these types

// Layouts
import AuthLayout from './layouts/AuthLayout';

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
// Component props type
type TitleSetterProps = {
  children: React.ReactNode;
};

// Helper component with TypeScript
const TitleSetter: React.FC<TitleSetterProps> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Get the current path and format it for the title
    const path = location.pathname;
    let title = 'Pitchmatter';
    
    // Map routes to title extensions
    if (path.includes('/auth/login')) {
      title += ' | Login';
    } else if (path.includes('/auth/register')) {
      title += ' | Register';
    } else if (path.includes('/auth/signup')) {
      title += ' | Sign Up';
    } else if (path.includes('/auth/forgot-password')) {
      title += ' | Forgot Password';
    } else if (path.includes('/auth/reset-password')) {
      title += ' | Reset Password';
    } else if (path.includes('/auth/check-mail')) {
      title += ' | Check Your Mail';
    } else if (path.includes('/auth/verify-email')) {
      title += ' | Verify Email';
    } else if (path.includes('/onboarding')) {
      title += ' | Welcome Onboard';
    } else if (path.includes('/dashboard')) {
      title += ' | Dashboard';
    }
    
    // Update document title
    document.title = title;
  }, [location]);
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Try to get current user on app load if token exists
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <TitleSetter>
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
    </TitleSetter>
  );
};

export default App;