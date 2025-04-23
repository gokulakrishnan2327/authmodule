import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError, loginWithGoogle, loginWithApple, loginWithLinkedIn } from '../features/auth/authSlice';
import OAuthButtons from '../components/OAuthButtons';
import Input from './common/Input';
import Button from './common/Button';

// Define types for form data
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
  captchaVerified: boolean;
  recaptchaToken: string | null;
}

// Define types for redux state
interface RootState {
  auth: {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  };
}

// Type for CustomLoader props
interface CustomLoaderProps {
  isVisible: boolean;
}

// Improved loading strategy for reCAPTCHA v3
// This avoids potential render blocking issues that can occur with direct imports

// Custom Loader Component with consistent Tailwind styling
const CustomLoader: React.FC<CustomLoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed flex flex-col items-center justify-center w-full max-w-lg h-[200px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D3436] rounded-lg z-50 transition-all duration-300 opacity-100 shadow-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-8">
        {/* Optimized loader animation with consistent spacing */}
        <div className="relative w-[85px] h-[85px] flex items-center justify-center bg-[#5D40ED] rounded-full animate-spin-slow">
          <div className="absolute flex items-center justify-between w-[45px]">
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
            <div className="w-[12px] h-[12px] bg-[#EFECFD] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Text content with proper font scaling */}
        <div className="flex flex-col items-center">
          <h4 className="font-roboto font-semibold text-2xl md:text-4xl leading-tight tracking-[-0.02em] text-center text-white">
            Thanks for the patience
          </h4>
          <p className="font-roboto font-medium text-base md:text-xl leading-5 tracking-[0.02em] text-center text-white mt-2">
            Amazing things coming from Pitchmatter
          </p>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const LoginForm: React.FC = () => {
  // Type the dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Use selector with type
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const recaptchaRef = useRef<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
    captchaVerified: false,
    recaptchaToken: null
  });
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Get email from localStorage that was set in StartLoginPage
  useEffect(() => {
    const storedEmail = localStorage.getItem('loginEmail');
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);
  
  // Load reCAPTCHA v3 script with deferred execution for performance optimization
  useEffect(() => {
    // Create and inject the reCAPTCHA v3 script with improved load handling
    const loadRecaptchaScript = () => {
      // Check if script is already loaded to prevent duplicates
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
    
    // Token refresh strategy - every 2 minutes for security
    const intervalId = setInterval(executeRecaptchaV3, 120000);
    
    // Cleanup function to prevent memory leaks
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Updated to handle reCAPTCHA v3 token
  const handleCaptchaChange = (token: string) => {
    setFormData(prev => ({
      ...prev,
      captchaVerified: !!token,
      recaptchaToken: token
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="w-full max-w-lg mx-auto text-left relative mt-8" >
      <div className="mb-4 h-18">
        <h1 className="font-roboto text-3xl font-semibold leading-tight tracking-tighter text-left text-[#2D3436]">
          Welcome Back!
        </h1>
        <p className="text-[#454551] mt-0.5 font-roboto text-left text-lg font-medium tracking-wide">
          You're just one step away from accessing your account
        </p>
      </div>
      
      <div className="mb-3 h-24 space-y-3">
        <p className="font-roboto font-medium text-left text-gray-800">
          Sign in with
        </p>

        {/* OAuth buttons with consistent spacing */}
        <OAuthButtons mode="login" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={!!localStorage.getItem('loginEmail')}
            required
          />
        </div>
        
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={focusedField === 'password' ? '' : 'Password'}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
          />
        </div>
        
        {/* reCAPTCHA v3 is invisible by default - we don't need UI indicator */}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded text-sm">
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
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-10 text-white font-medium rounded-lg text-sm"
          >
            Login
          </Button>
        </div>
      </form>
      
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
      
      <div className="mt-2 w-full max-w-lg mx-auto">
        <p className="font-roboto font-medium text-sm leading-5 tracking-wide text-left">
          By accessing your account, you agree to our{' '}
          <a href="/terms" className="font-medium text-sm leading-5 text-indigo-500 hover:underline transition-colors">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-medium text-sm leading-5 text-indigo-500 hover:underline transition-colors">
            Privacy Policy
          </a>.
        </p>
      </div>
      
      {/* <div className="mt-3 text-left">
        <p className="font-roboto text-base tracking-wider text-[#64646D]">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-[#5D40ED] font-roboto font-bold tracking-wider inline-block">
            Register
          </a>
        </p>
      </div> */}
      
      <CustomLoader isVisible={loading} />
    </div>
  );
};

export default LoginForm;