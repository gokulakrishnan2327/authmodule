import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import AuthLayout from '../../../layouts/AuthLayout';

const CheckYourMailPage = () => {
  const { email } = useSelector((state) => state.auth);
  
  const handleOpenEmailApp = () => {
    // Detect the user's email client and open it
    window.location.href = 'mailto:';
  };
  
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Check your mail
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a password reset link to your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Mail Paper Rocket Logo */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-6">
              <svg className="h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 9.5L12 17l7.5-7.5" />
              </svg>
            </div>
            
            <h3 className="mt-3 text-lg font-medium text-gray-900">Check your inbox</h3>
            <p className="mt-2 text-sm text-gray-500">
              We've sent a password reset link to{' '}
              <span className="font-medium text-gray-800">{email}</span>.
              <br />Please check your inbox and follow the instructions.
            </p>
            
            <div className="mt-6">
              <Button onClick={handleOpenEmailApp} variant="primary" fullWidth>
                Open Email App
              </Button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Did not receive the email?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Check your spam filter, or{' '}
                <Link to="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  try another email address
                </Link>
              </p>
            </div>
            
            <div className="mt-6">
              <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckYourMailPage;