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
      <div className="w-full max-w-lg mx-auto text-left" style={{ height: "450px" }}>
        <div className="mb-3 h-14">
          <h1 className="font-roboto text-3xl font-semibold leading-tight tracking-tighter text-left text-[#2D3436]">
            Welcome!
          </h1>
          <p className="text-[#454551] mt-0.5 font-roboto text-left text-lg font-medium tracking-wide">
            Please log in to access your account
          </p>
        </div>

        <div className="mb-3 h-24 space-y-3">
          <p className="font-roboto font-medium text-left text-gray-800">
            Sign in with
          </p>

          {/* Use our OAuthButtons component */}
          <OAuthButtons mode="login" />
        </div>
        
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-s">
            <span className="px-2 bg-white text-[#454551] font-roboto font-medium text-lg tracking-wide">
              Or enter your email to continue
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
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
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-12"
          >
            Continue
          </Button>
        </form>
        
        <div className="mt-3 w-full max-w-[510px] mx-auto">
          <p className="font-roboto font-medium text-sm leading-5 tracking-wide text-left">
            By accessing your account, you agree to our{' '}
            <a href="/terms" className="font-medium text-sm leading-5 text-indigo-500 hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-sm leading-5 text-indigo-500 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
        
        <div className="mt-3 text-left">
          <p className="font-roboto text-base tracking-wider text-[#64646D]">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-[#5D40ED] font-roboto font-bold tracking-wider inline-block">
              Register
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default StartLoginPage;