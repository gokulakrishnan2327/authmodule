import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import loginBg from '../../src/assets/images/login-bg.jpg';
import registerBg from '../../src/assets/images/register-bg.jpg';
import forgotPasswordBg from '../../src/assets/images/forgotpassword-bg.png';

const AuthLayout = ({ children }) => {
  const { error, successMessage } = useSelector((state) => state.auth);
  const location = useLocation();
  
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

  const getIllustrationPath = () => {
    const path = location.pathname;
    if (path.includes('/register')) {
      return registerBg;
    } else if (path.includes('/login')) {
      return loginBg;
    } else if (path.includes('/forgot-password')) {
      return forgotPasswordBg;
    }
    return loginBg;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row rounded-3xl shadow-xl overflow-hidden">
        <motion.div 
          className="hidden lg:block lg:w-1/2 relative"
          initial="hidden"
          animate="visible"
          variants={illustrationVariants}
        >
          <div 
            className="rounded-3xl overflow-hidden mx-5 my-5 lg:ml-5 lg:mr-10"
            style={{
              position: 'relative',
              height: '580px',
            }}
          >
            <img 
              src={getIllustrationPath()} 
              alt="Authentication illustration" 
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </motion.div>
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col items-center lg:items-start">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold mb-6 lg:mb-12 lg:-ml-10"
            style={{
              backgroundImage: 'linear-gradient(70.78deg, #000000 -0.46%, #5E41F1 45.54%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              fontFamily: 'Roboto, sans-serif',
              WebkitTextFillColor: 'transparent',
              color: 'transparent', /* Fallback */
              display: 'inline-block',
            }}
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            Pitchmatter
          </motion.h1>
          <motion.div 
            className="bg-white rounded-xl shadow-md w-full mx-auto lg:mx-0 lg:-ml-10 lg:-mt-10"
            style={{ 
              maxWidth: '516px',
            }}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            key={location.pathname}
          >
            <div className="p-6 space-y-6">
              {children || <Outlet />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;