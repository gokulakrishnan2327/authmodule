import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import Input from './common/Input';
import Button from './common/Button';
import ReCAPTCHA from 'react-google-recaptcha'; // Import for reCAPTCHA

// Custom Loader Component
const CustomLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed flex flex-col items-center justify-center w-[510px] h-[210px] top-[447px] left-[465px] bg-[#2D3436] rounded-lg z-50 transition-all duration-300 opacity-100 shadow-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-10">
        {/* Loader animation with rotating circle and pulsing dots */}
        <div className="relative w-[90px] h-[90px] flex items-center justify-center bg-[#5D40ED] rounded-full animate-spin-slow">
          <div className="absolute flex items-center justify-between w-[45px]">
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center">
          <h4 className="font-['Roboto'] font-semibold text-4xl leading-[48px] tracking-[-0.02em] text-center text-white">
            Thanks for the patience
          </h4>
          <p className="font-['Roboto'] font-medium text-xl leading-6 tracking-[0.02em] text-center text-white mt-2">
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
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    captchaVerified: false
  });
  
  // Get email from localStorage that was set in StartLoginPage
  useEffect(() => {
    const storedEmail = localStorage.getItem('loginEmail');
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);
  
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
  
  const handleCaptchaChange = (value) => {
    setFormData({
      ...formData,
      captchaVerified: !!value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  
  return (
    <div className="w-full max-w-lg mx-auto text-left relative" style={{ height: "470px" }}>
      <div className="mb-3 h-16">
        <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-left text-gray-900">
        Welcome Back!
        </h1>
        <p className="text-gray-600 mt-1 font-sans text-left text-sm">
        You're just one step away from accessing your account
        </p>
      </div>
      
      <div className="mb-2 h-24 space-y-3">
        <p className="font-sans font-medium text-left text-gray-800">
          Sign in with
        </p>

        <div className="flex space-x-4 justify-start">
          {/* Google button */}
          <button className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            <span className="ml-2 font-sans text-sm">Google</span>
          </button>
          
          {/* Apple button */}
          <button className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
            </svg>
            <span className="ml-2 font-sans text-sm">Apple</span>
          </button>
          
          {/* LinkedIn button */}
          <button className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/>
            </svg>
            <span className="ml-2 font-sans text-sm">LinkedIn</span>
          </button>
        </div>
      </div>
      
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={!!localStorage.getItem('loginEmail')}
            required
          />
        </div>
        
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            showEye={false} // Disable eye icon for password visibility
            required
          />
        </div>
        
       {/* reCAPTCHA integration with aligned layout and fixed width */}
        <div className="w-[510px] flex justify-between items-center mt-6">
          <div>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google test key
              onChange={handleCaptchaChange}
              size="normal" // Use "normal" for full box with checkbox + badge
            />
          </div>
        </div>


        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-[#5E41F1] focus:ring-[#5E41F1] border-gray-300 rounded"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm font-sans text-gray-900">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-sans font-medium text-[#5E41F1] hover:text-[#4933c8]">
              Forgot password?
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          className="bg-[#5E41F1] hover:bg-[#4933c8] font-sans transition-colors h-14"
        >
          Sign in
        </Button>
      </form>
      
      <div className="mt-3">
        <p className="font-sans font-medium text-xs leading-5 tracking-wider text-left">
          By accessing your account, you agree to our{' '}
          <a href="/terms" className="font-sans font-medium text-xs leading-5 tracking-wider text-[#5E41F1]">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-sans font-medium text-xs leading-5 tracking-wider text-[#5E41F1]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
      
      <div className="mt-3 w-60 h-5 text-left">
        <p className="font-sans text-sm leading-5 tracking-wider text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-[#5E41F1] font-sans font-bold inline-block">
            Sign up
          </Link>
        </p>
      </div>
      
      {/* Render the custom loader component when loading is true */}
      <CustomLoader isVisible={loading} />
    </div>
  );
};

export default LoginForm;