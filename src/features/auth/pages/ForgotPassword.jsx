import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearSuccessMessage } from '../authSlice';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import AuthLayout from '../../../layouts/AuthLayout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    // Dispatch the forgotPassword action and store the result
    const resultAction = await dispatch(forgotPassword({ email }));
    
    // If the action was fulfilled (successful), navigate to the check-mail page
    if (forgotPassword.fulfilled.match(resultAction)) {
      navigate('/auth/check-mail');
    }
  };
  
  const handleTryAgain = () => {
    setEmail('');
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };
  
  return (
    <AuthLayout>
      <div className="w-full max-w-md text-left">
        <h2 className="text-3xl text-gray-900 font-semibold"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '30px',
            lineHeight: '45px',
            letterSpacing: '-0.02em',
            verticalAlign: 'bottom'
          }}
        >
          Forgot your password?
        </h2>
        <p className="mt-2 text-gray-600"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '24px',
            letterSpacing: '0.02em'
          }}
        >
          Enter the email address you used when you joined and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg">
          {loading && (
            <div className="flex justify-center my-8">
              <Loader />
            </div>
          )}
          
          {!loading && error && (
            <div className="bg-red-50 p-4 rounded-md mb-6">
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
              <div className="mt-4">
                <Button onClick={handleTryAgain} variant="secondary" size="sm">
                  Try again
                </Button>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Example@Youremail.com"
                  />
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!email.trim() || loading}
                  className="flex items-center justify-center space-x-2 relative"
                >
                 
                  
                  <span className="mx-6">Send reset link</span>
                  
                  
                </Button>
              </div>
              
              <div className="text-left">
                <span
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '18px',
                    letterSpacing: '0.03em'
                  }}
                >
                  Back to{' '}
                </span>
                <Link 
                  to="/auth/login" 
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '18px',
                    letterSpacing: '0.03em'
                  }}
                >
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;