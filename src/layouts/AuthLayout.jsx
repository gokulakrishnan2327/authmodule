import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// Import images directly for better webpack/bundler handling
import loginBg from '../../src/assets/images/login-bg.jpg';
import registerBg from '../../src/assets/images/register-bg.jpg';
import forgotPasswordBg from '../../src/assets/images/forgotpassword-bg.png';

const AuthLayout = ({ children }) => {
  const { error, successMessage } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Animation variants
  const illustrationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6 
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 100, 
        delay: 0.2,
        duration: 0.5 
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        delay: 0.4,
        duration: 0.5 
      }
    }
  };

  // Determine which illustration to show based on the current route
  const getIllustrationPath = () => {
    const path = location.pathname;
    if (path.includes('/register')) {
      return registerBg;
    } else if (path.includes('/login')) {
      return loginBg;
    } else if (path.includes('/forgot-password')) {
      return forgotPasswordBg;
    }
    // Default fallback
    return loginBg;
  };

  // Reset animations when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row rounded-3xl shadow-xl overflow-hidden">
        {/* Left Column - Curved Illustration Section with Animation */}
        <motion.div 
          className="hidden lg:block lg:w-1/2 relative"
          initial="hidden"
          animate="visible"
          variants={illustrationVariants}
        >
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              position: 'relative',
              width: '630px',
              height: '780px',
              top: '0',
              left: '0',
              margin: '20px'
            }}
          >
            <img 
              src={getIllustrationPath()} 
              alt="Authentication illustration" 
              className="w-full h-full object-cover"
              style={{ 
                borderRadius: '40px',
              }}
            />
          </div>
        </motion.div>
        
        {/* Right Column - Auth Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
          {/* Gradient Title with Animation */}
          <motion.h1 
            className="text-3xl font-bold mb-8"
            style={{
              backgroundImage: 'linear-gradient(70.78deg, #000000 -0.46%, #5E41F1 45.54%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent', /* Fallback */
              maxWidth: '353px',
              display: 'inline-block'
            }}
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            Pitchmatter
          </motion.h1>
          
          {/* Error Alert */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-300">
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
            <div className="rounded-md bg-green-50 p-4 mb-6 border border-green-300">
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

          {/* Auth Form Container with Animation */}
          <motion.div 
            className="bg-white rounded-xl shadow-md w-full"
            style={{ maxWidth: '516px' }}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            key={location.pathname} // Forces animation to reset on route change
          >
            <div className="p-6 space-y-6">
              {children || <Outlet />}
            </div>
          </motion.div>
          
          <div className="mt-8 text-right text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pitchmatter. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;