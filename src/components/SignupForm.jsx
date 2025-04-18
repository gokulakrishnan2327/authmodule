import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearError } from '../features/auth/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateForm } from '../utils/validators';
import AuthLayout from '../layouts/AuthLayout';
// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password }) => {
  // Don't show anything if password is empty
  if (!password) return null;
  
  const getPasswordStrength = (password) => {
    if (password.length < 4) return 1; // Weak
    if (password.length < 7) return 2; // Medium
    return 3; // Strong
  };

  const strength = getPasswordStrength(password);
  
  // Define colors and active segments based on strength
  const getColorClass = (strength) => {
    switch (strength) {
      case 1: return 'bg-[#E9263A]'; // Weak - red
      case 2: return 'bg-[#FFC109]'; // Medium - yellow
      case 3: return 'bg-[#85B205]'; // Strong - green
      default: return 'bg-[#E8E8E9]'; // Default - light gray
    }
  };

  // Define message based on strength
  const getMessage = (strength) => {
    switch (strength) {
      case 0: return { text: 'Too short password', color: 'text-gray-500' };
      case 1: return { text: 'This is a weak ', color: 'text-[#E9263A]' };
      case 2: return { text: 'This is just a good ', color: 'text-[#FFC109]' };
      case 3: return { text: 'Wohoo! It\'s a strong ', color: 'text-[#85B205]' };
      default: return { text: '', color: '' };
    }
  };

  const message = getMessage(strength);
  
  // Determine which bars should be active and their colors
  const getBarStyles = (barIndex) => {
    // Default style for all bars
    let baseStyle = "w-[30px] h-[5px] rounded-full ";
    
    // Active styles based on strength
    if (strength === 1 && barIndex < 2) {
      return baseStyle + "bg-[#E9263A]"; // Weak - first 2 bars red
    } else if (strength === 2) {
      if (barIndex < 2) {
        return baseStyle + "bg-[#E9263A]"; // First 2 bars red
      } else if (barIndex < 4) {
        return baseStyle + "bg-[#FFC109]"; // Next 2 bars yellow
      }
    } else if (strength === 3) {
      if (barIndex < 2) {
        return baseStyle + "bg-[#E9263A]"; // First 2 bars red
      } else if (barIndex < 4) {
        return baseStyle + "bg-[#FFC109]"; // Next 2 bars yellow
      } else if (barIndex < 6) {
        return baseStyle + "bg-[#85B205]"; // Last 2 bars green
      }
    }
    
    // Default for inactive bars
    return baseStyle + "bg-[#94949B]";
  };

  return (
    <div className="mt-2">
      {/* Container for both bars and message in same line */}
      <div className="flex items-center justify-between">
        {/* Strength bars */}
        <div className="flex space-x-1">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={getBarStyles(index)}></div>
          ))}
        </div>
        
        {/* Strength message with info icon */}
        <div className="flex items-center gap-2">
          <span className={`font-roboto font-medium text-base leading-6 ${message.color}`}>
            {message.text}
          </span>
          <div className="w-5 h-5 rounded-full border-2 border-[#5D40ED] flex items-center justify-center text-[#5D40ED] text-xs font-bold">
            i
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-bold text-gray-900">You're All Set!</h3>
          <p className="mt-1 text-gray-600">
            Ready to unlock new possibilities?
          </p>
          <div className="mt-4">
            <Button onClick={onClose} fullWidth>
              Let's Go!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTermsError, setAgreeToTermsError] = useState('');
  
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
      // Or you could set a general form error
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
      'confirmPassword'
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
  
  return (
    <div className="w-full max-w-lg mx-auto text-left h-[650px]">
      <div className="mb-6">
        <h2 className="font-roboto text-2xl font-semibold leading-8 tracking-[-2%] text-left text-gray-900">
          Create Your Account
        </h2>
        <p className="text-sm font-roboto font-medium text-gray-600 text-left leading-5 tracking-[2%]">
          Create an account to begin accessing our content.
        </p>
      </div>

      <div className="mb-5">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled
          className="w-full h-11"
        />
      </div>
      
      <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
        <div className="mb-5">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            className="w-full h-10"
          />
        </div>
        
        <div className="mb-3">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            className="w-full h-11"
            showPassword={false} // Prevent the eye icon from showing
          />
          
          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formData.password} />
        </div>
        
        <div className="mb-5">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            className="w-full h-11"
            showPassword={false} // Prevent the eye icon from showing
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="col-span-1">
            <select
              id="countryCode"
              name="countryCode"
              className="w-full h-11 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#5E41F1] focus:border-[#5E41F1] text-sm flex items-center"
              value={formData.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map((code) => (
                <option key={code.value} value={code.value} className="flex items-center">
                  {code.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
  <Input
    id="phoneNumber"
    name="phoneNumber"
    type="tel"
    label="Phone Number"
    value={formData.phoneNumber}
    onChange={handleChange}
    error={errors.phoneNumber}
    required
    className="w-60 max-w-xs h-11"
    labelVisible={false}
  />
</div>

        </div>
        
        <div className="mb-5">
          <select
            id="role"
            name="role"
            className="w-full h-11 pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#5E41F1] focus:border-[#5E41F1]"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Role</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
        </div>
        
        <div className="flex items-start mb-5">
  <div className="flex items-center h-4">
    <input
      id="newsletter"
      name="newsletter"
      type="checkbox"
      className="h-4 w-4 text-[#5D40ED] focus:ring-[#5D40ED] border-2 border-[#5D40ED] rounded"
      checked={subscribeNewsletter}
      onChange={() => setSubscribeNewsletter(!subscribeNewsletter)}
    />
  </div>
  <div className="ml-2">
    <label htmlFor="newsletter" className="font-roboto font-medium text-sm leading-[100%] text-gray-700">
      Subscribe to our newsletter
    </label>
  </div>
</div>
        
        <div className="mb-5">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            className="bg-[#5E41F1] hover:bg-[#4933c8] font-sans transition-colors h-10"
          >
          Register
          </Button>
        </div>
        
        <p className="text-xs text-gray-600 font-sans text-left mb-3">
          Already have an account?{' '}
          <Link to="/auth/start-login" className="font-medium text-[#5E41F1] hover:text-[#4933c8] font-sans">
            Sign in
          </Link>
        </p>

        <div className="mb-4">
          <p className="font-sans font-medium text-xs leading-4 tracking-wider text-left">
            By accessing your account, you agree to our{' '}
            <a href="/terms" className="font-sans font-medium text-xs leading-4 tracking-wider text-[#5E41F1]">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-sans font-medium text-xs leading-4 tracking-wider text-[#5E41F1]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
      
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} />
    </div>
  );
};

export default SignupForm;