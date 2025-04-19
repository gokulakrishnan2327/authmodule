import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { isEmailValid } from '../../../utils/validators';
import AuthLayout from '../../../layouts/AuthLayout';
import OAuthButtons from '../../../components/OAuthButtons';

const StartLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim() || !isEmailValid(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    // Store email in localStorage for the next step
    localStorage.setItem('loginEmail', email);
    
    // Simulate API delay and redirect to login page
    setTimeout(() => {
      setLoading(false);
      navigate('/auth/login');
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto text-left" style={{ height: "490px" }}>
        <div className="mb-4 h-16">
          <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-left text-gray-900">
            Welcome!
          </h1>
          <p className="text-gray-600 mt-1 font-sans text-left text-sm">
            Please log in to access your account
          </p>
        </div>

        <div className="mb-4 h-28 space-y-4">
          <p className="font-sans font-medium text-left text-gray-800">
            Sign in with
          </p>

          {/* Use our OAuthButtons component */}
          <OAuthButtons mode="login" />
        </div>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500 font-sans">
              Or enter your email to continue
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              required
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-sans transition-colors h-14"
          >
            Continue
          </Button>
        </form>
        
        <div className="mt-4">
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
        
        <div className="mt-4 w-60 h-5 text-left">
          <p className="font-sans text-sm leading-5 tracking-wider text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-[#5E41F1] font-sans font-bold inline-block">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default StartLoginPage;