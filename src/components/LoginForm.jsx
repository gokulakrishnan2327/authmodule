import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError, loginWithGoogle, loginWithApple, loginWithLinkedIn } from '../features/auth/authSlice';
import OAuthButtons from '../components/OAuthButtons';
import Input from './common/Input';
import Button from './common/Button';
// Replace ReCAPTCHA import with script loading approach for v3
// import ReCAPTCHA from 'react-google-recaptcha'; 

// Custom Loader Component
const CustomLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed flex flex-col items-center justify-center w-[510px] h-[200px] top-[447px] left-[465px] bg-[#2D3436] rounded-lg z-50 transition-all duration-300 opacity-100 shadow-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-8">
        {/* Loader animation with rotating circle and pulsing dots */}
        <div className="relative w-[85px] h-[85px] flex items-center justify-center bg-[#5D40ED] rounded-full animate-spin-slow">
          <div className="absolute flex items-center justify-between w-[45px]">
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center">
          <h4 className="font-roboto font-semibold text-4xl leading-[44px] tracking-[-0.02em] text-center text-white">
            Thanks for the patience
          </h4>
          <p className="font-roboto font-medium text-xl leading-5 tracking-[0.02em] text-center text-white mt-2">
            Amazing things coming from Pitchmatter
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const recaptchaRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    captchaVerified: false,
    recaptchaToken: null
  });
  
  const [focusedField, setFocusedField] = useState(null);
  
  // Get email from localStorage that was set in StartLoginPage
  useEffect(() => {
    const storedEmail = localStorage.getItem('loginEmail');
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);
  
  // Load reCAPTCHA v3 script when component mounts
  useEffect(() => {
    // Create and inject the reCAPTCHA v3 script
    const loadRecaptchaScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src^="https://www.google.com/recaptcha/api.js?render="]')) {
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;
      script.async = true;
      script.defer = true;
      
      // When script is loaded, initialize reCAPTCHA
      script.onload = () => {
        recaptchaRef.current = window.grecaptcha;
        
        // Execute reCAPTCHA to get initial token
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            executeRecaptchaV3();
          });
        }
      };
      
      document.head.appendChild(script);
    };
    
    loadRecaptchaScript();
    
    // Refresh token every 2 minutes (120000ms)
    const intervalId = setInterval(executeRecaptchaV3, 120000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // Execute reCAPTCHA v3 and get a token
  const executeRecaptchaV3 = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'login_form' })
          .then(token => {
            // Handle the reCAPTCHA token
            handleCaptchaChange(token);
          })
          .catch(error => {
            console.error('reCAPTCHA error:', error);
            setFormData(prev => ({
              ...prev,
              captchaVerified: false,
              recaptchaToken: null
            }));
          });
      });
    }
  };
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Updated to handle reCAPTCHA v3 token
  const handleCaptchaChange = (token) => {
    setFormData(prev => ({
      ...prev,
      captchaVerified: !!token,
      recaptchaToken: token
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get a fresh token when submitting the form
    if (window.grecaptcha) {
      try {
        await window.grecaptcha.ready(async () => {
          const token = await window.grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'login_submit' });
          
          // Update token in form data
          const updatedFormData = {
            ...formData,
            captchaVerified: !!token,
            recaptchaToken: token
          };
          
          // Dispatch login action with updated form data including fresh token
          dispatch(loginUser(updatedFormData));
        });
      } catch (error) {
        console.error('Error executing reCAPTCHA:', error);
        alert('Failed to verify reCAPTCHA. Please try again.');
      }
    } else {
      alert('reCAPTCHA failed to load. Please refresh the page and try again.');
    }
  };
  
  return (
    <div className="w-full max-w-[516px] mx-auto text-left relative h-[540px] -mt-4">
      <div className="mb-2">
        <h1 className="font-roboto text-3xl font-semibold leading-tight tracking-tighter text-left text-[#2D3436]">
          Welcome Back!
        </h1>
        <p className="text-[#454551] mt-0.5 font-roboto text-left text-lg font-small tracking-wide">
          You're just one step away from accessing your account
        </p>
      </div>
      
      <div className="mb-2 h-20 space-y-2">
        <p className="font-roboto font-medium text-left text-gray-800">
          Sign in with
        </p>

        {/* Use our OAuthButtons component */}
        <OAuthButtons mode="login" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="relative">
            <label 
              htmlFor="email" 
              className="absolute text-xs font-roboto font-normal text-[#64646D] left-3 top-1.5 px-1 bg-white z-10"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!localStorage.getItem('loginEmail')}
              className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-gray-300 text-[#171725] font-poppins font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        
        <div className="relative">
          <div className="relative">
            <label 
              htmlFor="password" 
              className={`absolute text-xs font-roboto font-normal text-[#64646D] left-3 top-1.5 px-1 bg-white z-10 transition-opacity duration-150 ${focusedField === 'password' || formData.password ? 'opacity-100' : 'opacity-0'}`}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={focusedField === 'password' ? '' : 'Password'}
              className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-[#94949B] text-black font-poppins font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>
        </div>
        
        {/* reCAPTCHA v3 badge container - invisible unless suspicious activity */}
        <div className="w-full flex justify-start items-center mt-1">
          <div 
            id="recaptcha-badge" 
            className="h-[20px] w-[450px]"
          >
            {/* reCAPTCHA v3 is invisible by default and shows badge at bottom right */}
            {/* Adding a visual indicator that protection is active */}
            <div className="flex items-center text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Protected by reCAPTCHA v3
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-2 text-sm">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mt-2">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-sans transition-colors h-10 text-white font-medium rounded-lg text-sm"
          >
            Login
          </Button>
        </div>
      </form>
      
      {/* Improved password reset section */}
      <div className="flex items-start mt-3">
        <div className="text-sm text-gray-600">
          <span className="font-roboto">
            If you forgot your password, 
            <Link 
              to="/auth/forgot-password" 
              className="ml-1 font-medium text-[#5D40ED] hover:text-[#4933c8] transition-colors duration-200"
            >
              clicking here!
            </Link>
          </span>
        </div>
      </div>
      
      <div className="mt-2 w-full max-w-[510px] mx-auto">
        <p className="font-roboto font-medium text-sm leading-4 tracking-wide text-left">
          By accessing your account, you agree to our{' '}
          <a href="/terms" className="font-medium text-sm leading-4 text-[#5D40ED] hover:text-[#4933c8] hover:underline transition-colors">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-medium text-sm leading-4 text-[#5D40ED] hover:text-[#4933c8] hover:underline transition-colors">
            Privacy Policy
          </a>.
        </p>
      </div>
      
      {/* Render the custom loader component when loading is true */}
      <CustomLoader isVisible={loading} />
    </div>
  );
};

export default LoginForm;