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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row  overflow-hidden">
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
              width: '530px', 
              height: '580px',
              top: '0',
              left: '0',
              margin: '20px 40px 20px 20px'
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
        <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col">
        <motion.h1 
  className="text-3xl lg:text-5xl font-bold mb-12 tracking-wide"
  style={{
    backgroundImage: 'linear-gradient(80.78deg, #000000 -0.46%, #5E41F1 60.54%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    fontFamily: 'Roboto, sans-serif',
    WebkitTextFillColor: 'transparent',
    color: 'transparent', /* Fallback */
    width: '353px',
    display: 'inline-block',
    marginLeft: '-10px',
    letterSpacing: '0.01em',
    textAlign: 'left',
    fontWeight: '800',
    lineHeight: '1.1'
  }}
  initial="hidden"
  animate="visible"
  variants={titleVariants}
>
  Pitchmatter
</motion.h1>
          <motion.div 
            // className="bg-white rounded-xl shadow-md w-full"
            style={{ 
              maxWidth: '516px',
               marginLeft: '-40px', // Move the entire card 40px to the left
               marginTop: '-40px'   // And 40px up
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