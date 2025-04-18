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
      <div className="w-full max-w-lg">
        <div className="bg-white py-0 px-4 shadow sm:rounded-lg">
          {/* Modern Mail Paper Rocket Logo - Centered */}
          <div className="flex justify-center mb-2">
            <svg width="194" height="168" viewBox="0 0 294 268" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M147 20L264 134L147 248L30 134L147 20Z" fill="#E3F2FD"/>
              <path d="M147 40L240 134L147 228L54 134L147 40Z" fill="#90CAF9"/>
              <path d="M147 60L216 134L147 208L78 134L147 60Z" fill="#42A5F5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M147 80C121.042 80 100 101.042 100 127V177.5C100 186.06 106.94 193 115.5 193H178.5C187.06 193 194 186.06 194 177.5V127C194 101.042 172.958 80 147 80ZM147 100L179 134H115L147 100Z" fill="#1976D2"/>
              <path d="M115 134L147 168L179 134" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M147 80V168" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <path d="M100 134H194" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* All other elements aligned left */}
          <div className="text-left">
            <h3 
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '30px',
                lineHeight: '40px',
                letterSpacing: '-0.02em',
                verticalAlign: 'bottom',
                width: '100%',
                maxWidth: '511px'
              }}
              className="text-gray-900"
            >
              Check your mail
            </h3>
            
            <p 
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                letterSpacing: '0.02em',
               
                padding: '12px',
                borderRadius: '4px',
                marginTop: '16px',
                width: '100%',
                maxWidth: '511px'
              }}
            >
              We have sent a password recover Instructions to your email.{' '}
              <span className="font-medium">{email}</span>
            </p>
            
            <div className="mt-6">
              <Button onClick={handleOpenEmailApp} variant="primary" fullWidth>
                Open Email App
              </Button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p 
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '24px',
                  letterSpacing: '0.02em',
                  width: '100%',
                  maxWidth: '511px'
                }}
              >
                Did not receive the email? Check your spam filter, or{' '}
                <Link 
                  to="/auth/forgot-password" 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '24px',
                    letterSpacing: '0.02em'
                  }}
                >
                  try another email address
                </Link>
              </p>
            </div>
            
            <div 
              className="mt-6"
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                letterSpacing: '0.02em',
                width: '100%',
                maxWidth: '511px'
              }}
            >
              Back to{' '}
              <Link 
                to="/auth/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '24px',
                  letterSpacing: '0.02em'
                }}
              >
                sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckYourMailPage;