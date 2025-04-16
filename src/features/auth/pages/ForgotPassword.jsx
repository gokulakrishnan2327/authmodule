import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearSuccessMessage } from '../authSlice';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import AuthLayout from '../../../layouts/AuthLayout';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    dispatch(forgotPassword({ email }));
    setSubmitted(true);
  };
  
  const handleTryAgain = () => {
    setEmail('');
    setSubmitted(false);
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };
  
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading && (
            <div className="flex justify-center my-8">
              <Loader />
            </div>
          )}
          
          {!loading && successMessage && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-sm text-gray-500">
                We've sent a password reset link to {email}. Please check your inbox.
              </p>
              <div className="mt-6">
                <Button onClick={handleTryAgain} variant="secondary">
                  Use a different email
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Return to sign in
                </Link>
              </p>
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
          
          {!loading && !successMessage && !error && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!email.trim() || loading}
                >
                  Send reset link
                </Button>
              </div>
              
              <div className="text-center">
                <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                  Back to sign in
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