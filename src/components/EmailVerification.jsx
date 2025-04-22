import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyEmail, clearError, clearSuccessMessage } from '../features/auth/authSlice';
import Button from './common/Button';
import Loader from './common/Loader';
import Input from './common/Input';
import AuthLayout from '../layouts/AuthLayout';

const EmailVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, successMessage, emailVerified } = useSelector((state) => state.auth);
  
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState('');
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // Get the email from localStorage on initial render
  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  
  // Extract and process token from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-verify with token from URL
      dispatch(verifyEmail(tokenParam));
    }
  }, [location.search, dispatch]);
  
  // Handle countdown timer for resend functionality
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);
  
  // Clean up messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);
  
  // Handle successful email verification
  useEffect(() => {
    if (emailVerified) {
      navigate('/auth/signup');
    }
  }, [emailVerified, navigate]);
  
  // Handle resending verification email
  const handleResendVerification = () => {
    // In a real app, this would call an API to resend the verification email
    console.log('Resending verification email to:', email);
    
    // Mock success
    setTimeout(() => {
      dispatch({
        type: '/api/auth/resend-verification',
        payload: { message: 'Verification email sent successfully!' }
      });
    }, 1000);
    
    // Start countdown (60 seconds)
    setCountdown(60);
  };
  
  const handleManualVerification = () => {
    if (!token.trim()) {
      setShowExpiredMessage(true);
      return;
    }
    console.log('Sending verification:', { email, token });
    // Send both email and code
    dispatch(verifyEmail({ email, code: token }))
    
      .unwrap()
      .then(() => {
        navigate('/auth/signup');
      })
      
      .catch(() => {
        // Error handling via redux state
      });
  };

  // Handle email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Save email to localStorage and exit edit mode
  const saveEmail = () => {
    localStorage.setItem('signupEmail', email);
    setIsEditingEmail(false);
  };

  // Handle verification token input changes
  const handleTokenChange = (e) => {
    setToken(e.target.value);
    if (showExpiredMessage) setShowExpiredMessage(false);
  };
  
  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto text-left mt-14 sm:px-0">
        <div className="mb-8">
          <Link 
            to="/auth/register" 
            className="inline-flex items-center text-[#5D40ED] hover:text-indigo-700 font-roboto font-semibold text-sm tracking-[0.03em] transition-colors duration-200 gap-2"
          >
            <div className="flex items-center justify-center bg-[#5D40ED] rounded-full p-0.5 w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Go Back</span>
          </Link>
        </div>

        {/* Header section with compact typography */}
        <div className="mb-6 space-y-1.5">
          <h1 className="font-roboto font-semibold text-2xl md:text-3xl leading-tight tracking-[-0.02em] text-[#2D3436]">
            Verify Your Identity
          </h1>
          <p className="font-roboto font-medium text-base leading-5 tracking-[0.02em] text-[#454551]">
            We've sent an email with your code to 
          </p>
          <p className="font-roboto font-medium text-base leading-5 tracking-[0.02em] text-[#5D40ED] break-all">
            {email}
          </p>
        </div>

        {/* Email edit section with custom input field and label */}
        <div className="mb-6">
  <div className="flex items-center w-full">
    {isEditingEmail ? (
      <div className="flex items-center w-full gap-2">
        
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="Email address"
            onChange={handleEmailChange}
            // className="w-full h-12 px-4 pt-5 pb-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        <button
          onClick={saveEmail}
          className="ml-2 text-indigo-600 hover:text-indigo-800 text-sm font-bold whitespace-nowrap transition-colors duration-200"
          type="button"
        >
          Save
        </button>
      </div>
    ) : (
      <div className="relative w-full">
        
        <div className="flex items-center w-full h-10 border border-gray-300 rounded-md pl-3 pr-2 bg-white shadow-sm">
          <span className="flex-grow font-medium text-gray-800 truncate mr-2 pt-0">{email || 'your email address'}</span>
          <button
            onClick={() => setIsEditingEmail(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
    )}
  </div>
</div>

        {/* Status messages with more compact styling */}
        {error && (
          <div className="bg-red-50 p-2.5 rounded-md mb-3 border border-red-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 p-2.5 rounded-md mb-3 border border-green-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {showExpiredMessage && !error && (
          <div className="bg-yellow-50 p-2.5 rounded-md mb-3 border border-yellow-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-yellow-800">
                  Please enter a valid verification code or request a new verification email.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification form with improved spacing and input field */}
        <form className="space-y-6">
          <div>
            <Input
              id="token"
              name="token"
              type="text"
              value={token}
              onChange={handleTokenChange}
              placeholder="Enter the code"
              error={showExpiredMessage ? "Please enter a valid code" : ""}
              required
            />
          </div>
          
          <Button
            type="button"
            onClick={handleManualVerification}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-800 font-medium transition-colors duration-200 h-10 rounded-md"
          >
            Continue
          </Button>
        </form>
        
        <div className="mt-4 text-left">
          <p className="font-roboto font-bold text-sm leading-[16px] tracking-[0.03em] text-[#64646D]">
            Didn't receive an email?{' '}
            {countdown > 0 ? (
              <span className="text-gray-500 font-medium">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendVerification}
                className="font-bold text-[#5D40ED] hover:text-indigo-700 transition-colors duration-200"
                disabled={loading || countdown > 0}
              >
                Resend
              </button>
            )}
          </p>
        </div>
        
        <div className="mt-4 w-full max-w-[510px] mx-auto">
          <p className="font-roboto font-medium text-sm leading-6 tracking-wide text-left">
            By accessing your account, you agree to our{' '}
            <a href="/terms" className="font-medium text-sm leading-6 text-indigo-500 hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-sm leading-6 text-indigo-500 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;