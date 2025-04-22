import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError, clearSuccessMessage } from '../authSlice';
import { doPasswordsMatch } from '../../../utils/validators';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  
  // Get token from URL query params
  const token = new URLSearchParams(location.search).get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Clear messages when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);
  
  // Show success popup when password reset is successful
  useEffect(() => {
    if (successMessage) {
      setResetSuccess(true);
    }
  }, [successMessage]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Validate new password
    const passwordError = doPasswordsMatch(formData.newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    
    // Check if new passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch(resetPassword({
      token,
      newPassword: formData.newPassword
    }));
  };
  
  const handleDone = () => {
    navigate('/auth/login');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Function to render password visibility icons
  const renderPasswordEyeIcon = (isVisible) => {
    if (isVisible) {
      return (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto text-left mt-10" style={{ height: "480px" }}>
        <div className="mb-6 h-20">
          <h1 className="font-roboto text-3xl font-semibold leading-relaxed tracking-tighter text-left text-[#2D3436]">
            Create new password
          </h1>
          <p className="text-[#454551] mt-1.5 font-roboto text-left text-base font-medium tracking-wide leading-6">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <div className="mt-10 w-full">
          <div className="bg-white py-8 px-0">
            {loading && (
              <div className="flex justify-center my-6">
                <Loader />
              </div>
            )}
            
            {error && !resetSuccess && (
              <div className="bg-red-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 leading-5">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success popup */}
            {resetSuccess ? (
              <div className="text-left py-8">
                <div className="flex items-center justify-start h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">All set!</h3>
                <p className="mt-2 text-gray-600">Your password's been updated.</p>
                <div className="mt-8">
                  <Button
                    onClick={handleDone}
                    variant="primary"
                    fullWidth
                    className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-12"
                  >
                    <span className="mx-4 font-large">Done</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium font-bold text-gray-700 text-left font-roboto mb-2">
                    Password (minimum length 8 characters)
                  </label>
                  <div className="mt-1.5 relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      // className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* {formData.newPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={togglePasswordVisibility}
                      >
                        {renderPasswordEyeIcon(showPassword)}
                      </button>
                    )} */}
                  </div>
                  {formErrors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium font-bold text-gray-700 text-left font-roboto mb-2">
                    Confirm Password
                  </label>
                  <div className="mt-1.5 relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      // className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* {formData.confirmPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {renderPasswordEyeIcon(showConfirmPassword)}
                      </button>
                    )} */}
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                    className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-10"
                  >
                    <span className="mx-4 font-large">Reset Password</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;