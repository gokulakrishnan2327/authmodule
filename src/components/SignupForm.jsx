import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearError } from '../features/auth/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateForm } from '../utils/validators';
import PasswordStrengthIndicator from '../components/common/PasswordStrengthIndicator';
import SuccessModal from './common/SuccessModal';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, profileStatus, error } = useSelector((state) => state.auth);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    role: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  
  const [errors, setErrors] = useState({});
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Get email from previous step
  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);
  
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

  // Display error from Redux state
  useEffect(() => {
    if (error) {
      // Map server errors to form fields if possible
      if (error.includes('email')) {
        setErrors(prev => ({ ...prev, email: error }));
      } else if (error.includes('password')) {
        setErrors(prev => ({ ...prev, password: error }));
      }
    }
  }, [error]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const roleOptions = [
    { value: 'founder', label: '👤 Founder' },
    { value: 'investor', label: '💰 Investor' },
    { value: 'mentor', label: '🎓 Mentor' },
    { value: 'vendor', label: '🛍️ Vendor' },
    { value: 'talent', label: '💼 Talent' },
  ];
  
  const countryCodes = [
    { value: '+1', label: '+1 (US)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+91', label: '+91 (IN)' },
    { value: '+61', label: '+61 (AU)' },
    { value: '+33', label: '+33 (FR)' },
    { value: '+49', label: '+49 (DE)' },
    { value: '+81', label: '+81 (JP)' },
    { value: '+86', label: '+86 (CN)' },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = validateForm(formData, [
      'fullName', 
      'email', 
      'phoneNumber', 
      'role', 
      'password', 
    ]);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }
    
    // Format phone number with country code
    const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
    
    // Remove confirmPassword and prepare data for submission
    const { confirmPassword, countryCode, phoneNumber, ...signupData } = formData;
    signupData.phoneNumber = formattedPhoneNumber;
    
    // Add newsletter subscription preference
    signupData.subscribeNewsletter = subscribeNewsletter;
    
    console.log('Submitting signup data:', signupData);
    
    dispatch(signupUser(signupData))
      .unwrap()
      .then(() => {
        setShowSuccessModal(true);
        navigate('/onboarding'); // Directly navigate to onboarding
        console.log('Signup successful');
      })
      .catch((error) => {
        console.error('Signup failed:', error);
      });
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/auth/start-login'); // Redirect to StartLoginPage
  };

  const renderErrorTooltip = (fieldName) => {
    if (!errors[fieldName]) return null;
    
    return (
      <div className="absolute right-0 mt-1 z-10">
        <div className="bg-red-200 text-black rounded-lg p-2 w-64 md:w-72 shadow-lg relative">
          <div className="absolute -top-2 right-4 w-3 h-3 bg-red-200 transform rotate-45"></div>
          <p className="text-xs">{errors[fieldName]}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-[516px] mx-auto text-left h-[560px] -mt-4">
      <div className="mb-3">
      <h1 className="font-roboto text-3xl font-semibold leading-tight tracking-tighter text-left text-[#2D3436]">
      Create Your Account
        </h1>
        <p className="text-[#454551] mt-0.5 font-roboto text-left text-lg font-small tracking-wide">
        Create an account to begin accessing our content.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
         
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              // className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-gray-300 text-[#171725] font-poppins font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          {renderErrorTooltip('email')}
        </div>
        
        <div className="relative">
            
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={focusedField === 'fullName' ? '' : 'Full Name'}
              // className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-[#94949B] text-black font-poppins font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
          {renderErrorTooltip('fullName')}
        </div>
        
        <div className="relative">
          
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={focusedField === 'password' ? '' : 'Password'}
              // className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-[#94949B] text-black font-poppins font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          {renderErrorTooltip('password')}
          <PasswordStrengthIndicator password={formData.password} />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1 relative">
           
            <select
              id="countryCode"
              name="countryCode"
              className="w-full h-10 rounded-lg border border-[#899197] pt-0 pb-0 px-4 text-[#091E42] font-roboto font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={formData.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-3 relative">
            
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={focusedField === 'phoneNumber' ? '' : 'Phone Number'}
                // className="w-full h-11 px-4 pt-5 pb-1 rounded-lg bg-white border border-[#899197] text-black font-roboto font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onFocus={() => setFocusedField('phoneNumber')}
                onBlur={() => setFocusedField(null)}
              />
            {renderErrorTooltip('phoneNumber')}
          </div>
        </div>
        
        <div className="relative">
          <div className="relative">
            <label 
              htmlFor="role" 
              className={`absolute text-xs font-roboto font-normal text-[#64646D] left-3 top-1.5 px-0 bg-white z-10 transition-opacity duration-150 ${focusedField === 'role' || formData.role ? 'opacity-100' : 'opacity-0'}`}
            >
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                className="w-full h-10 pl-4 pr-10 pt-0 pb-0 text-sm bg-white border border-[#94949B] rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.role}
                onChange={handleChange}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled>{focusedField === 'role' ? '' : 'Role'}</option>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          {renderErrorTooltip('role')}
        </div>
        
        <div className="flex items-center mt-2">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-2 border-[#5D40ED] rounded"
            checked={subscribeNewsletter}
            onChange={() => setSubscribeNewsletter(!subscribeNewsletter)}
          />
          <label htmlFor="newsletter" className="ml-2 block text-s font-roboto font-bold font-medium text-[#64646D]">
            Subscribe to our newsletter
          </label>
        </div>
        
        <div className="mt-3">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-sans transition-colors h-10 text-white font-medium rounded-lg text-sm"
          >
            Register
          </Button>
        </div>
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
      </form>
      
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} />
    </div>
  );
};

export default SignupForm;