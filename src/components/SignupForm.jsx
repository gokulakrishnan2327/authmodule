// src/features/auth/components/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearError } from '../features/auth/authSlice';
import Input from './common/Input';
import Button from './common/Button';
import { validateForm } from '../utils/validators';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, profileStatus } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTermsError, setAgreeToTermsError] = useState('');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (profileStatus === 'complete') {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [isAuthenticated, profileStatus, navigate]);
  
  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check terms agreement
    if (!agreeToTerms) {
      setAgreeToTermsError('You must agree to the terms and conditions');
      return;
    }
    
    // Validate form
    const validationResult = validateForm(formData, ['fullName', 'email', 'password', 'confirmPassword']);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }
    
    // Remove confirmPassword and prepare data for submission
    const { confirmPassword, ...signupData } = formData;
    
    // Dispatch signup action
    dispatch(signupUser(signupData));
  };
  
  const handleSocialSignup = (provider) => {
    // Mock social signup for now
    console.log(`Initiating ${provider} signup...`);
    // In a real implementation, you would redirect to the OAuth provider
    // or use Firebase authentication
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <Input
          id="referralCode"
          name="referralCode"
          type="text"
          label="Referral Code (Optional)"
          value={formData.referralCode}
          onChange={handleChange}
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.5 5a1 1 0 01.708 1.707l-1.45 1.45a1 1 0 01-1.414-1.414l.342-.343-1.05-1.05a1 1 0 01.707-1.707z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={agreeToTerms}
              onChange={() => {
                setAgreeToTerms(!agreeToTerms);
                if (agreeToTermsError) setAgreeToTermsError('');
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary-dark">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary-dark">
                Privacy Policy
              </a>
            </label>
            {agreeToTermsError && (
              <p className="mt-1 text-sm text-error">{agreeToTermsError}</p>
            )}
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Create account
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignup('google')}
            className="bg-white"
          >
            <span className="sr-only">Sign up with Google</span>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignup('linkedin')}
            className="bg-white"
          >
            <span className="sr-only">Sign up with LinkedIn</span>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.338 16.338H13.67V12.16c0-1-.02-2.285-1.397-2.285-1.397 0-1.61 1.087-1.61 2.21v4.253h-2.668V8.33h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.705 0 3.21 1.778 3.21 4.092v4.132zM5.5 7.159a1.677 1.677 0 1 1 0-3.35 1.677 1.677 0 0 1 0 3.35zm1.334 9.179H4.166V8.33h2.668v8.008zM17.5 1H2.5a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 2.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 17.5 1z"
                clipRule="evenodd"
              />
            </svg>
            LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;