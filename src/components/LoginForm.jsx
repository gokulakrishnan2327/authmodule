import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError, loginWithGoogle, loginWithApple, loginWithLinkedIn } from '../features/auth/authSlice';
import OAuthButtons from '../components/OAuthButtons';
import Input from './common/Input';
import Button from './common/Button';
import ReCAPTCHA from 'react-google-recaptcha'; 

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
    
    // Validate captcha before login
    if (!formData.captchaVerified) {
      // You might want to show an error instead
      alert('Please verify that you are not a robot');
      return;
    }
    
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

        {/* Use our OAuthButtons component */}
        <OAuthButtons mode="login" />
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
          disabled={!formData.captchaVerified}
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
          </a>.
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