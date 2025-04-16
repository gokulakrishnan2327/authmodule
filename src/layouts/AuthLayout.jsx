// src/layouts/AuthLayout.jsx
import React from 'react';
import { Link ,Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = ({ children }) => {
  const { error, successMessage } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-primary-dark flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex justify-center">
            <img 
              src="/logo.svg" 
              alt="Fintech Dashboard Logo" 
              className="h-12 w-auto" 
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
Pitchmatter          </h2>
         
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-300">
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

        {/* Success Alert */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 mb-4 border border-green-300">
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

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Fintech Dashboard. All rights reserved.
          </p>
        </div>
      </div>
       {/* <Outlet />  */}
    </div>
  );
};

export default AuthLayout;