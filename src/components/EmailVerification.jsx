import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyEmail, clearError, clearSuccessMessage } from '../features/auth/authSlice';
import Button from './common/Button';
import Loader from './common/Loader';
import AuthLayout from '../layouts/AuthLayout';

const EmailVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, successMessage, emailVerified, profileStatus } = useSelector((state) => state.auth);
  
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState('');
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // Get the email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  
  // Extract token from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-verify with token from URL
      dispatch(verifyEmail(tokenParam));
    }
  }, [location.search, dispatch]);
  
  // Setup countdown for resend functionality
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);
  
  // Clear messages when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);
  
  // Modified: Now redirects to signup page on successful verification
  useEffect(() => {
    if (emailVerified) {
      navigate('/auth/signup');
    }
  }, [emailVerified, navigate]);
  
  const handleResendVerification = () => {
    // In a real app, this would call an API to resend the verification email
    console.log('Resending verification email to:', email);
    
    // Mock success
    setTimeout(() => {
      // Success message would be dispatched by the actual API call
      dispatch({
        type: 'auth/resendVerification/fulfilled',
        payload: { message: 'Verification email sent successfully!' }
      });
    }, 1000);
    
    // Start countdown (60 seconds)
    setCountdown(60);
  };
  
  const handleManualVerification = () => {
    if (!token.trim()) {
      // Show error for empty token
      setShowExpiredMessage(true);
      return;
    }
    
    // Dispatch verification action
    dispatch(verifyEmail(token))
      .unwrap()
      .then(() => {
        // On successful verification, navigate to signup page
        navigate('/auth/signup');
      })
      .catch(() => {
        // Error handling is already done via the redux state
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const saveEmail = () => {
    // Save the updated email to localStorage
    localStorage.setItem('signupEmail', email);
    setIsEditingEmail(false);
  };
  
  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <Link 
            to="/auth/signup" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go back
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Verify Your Identity <br />
            We've sent an email with your code to:
          </p>
          
          {/* Email display with edit functionality */}
          <div className="mt-2 flex justify-center items-center">
            {isEditingEmail ? (
              <div className="flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={saveEmail}
                  className="ml-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <strong className="text-gray-800">{email || 'your email address'}</strong>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="ml-2 text-indigo-600 hover:text-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-6">
            <Loader />
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {showExpiredMessage && !error && (
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Please enter a valid verification token or request a new verification email.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="space-y-6">
            <div>
              <div className="mt-1">
                <input
                  id="token"
                  name="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the code"
                />
              </div>
            </div>

            <div>
              <Button
                onClick={handleManualVerification}
                disabled={loading || !token.trim()}
                variant="primary"
                fullWidth
              >
                Continue
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code? 
                {countdown > 0 ? (
                  <span className="ml-1 text-gray-500">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium"
                    disabled={loading || countdown > 0}
                  >
                    Resend 
                  </button>
                )}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                By accessing your account, you agree to our{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</Link> and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;