import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError, clearSuccessMessage } from '../features/auth/authSlice';
import Button from './common/Button';
import Loader from './common/Loader';

// Step components
import RoleSelection from './onboarding/RoleSelection';
import InterestsSelection from './onboarding/InterestsSelection';
import ProfilePhotos from './onboarding/ProfilePhotos';
import GoalsSelection from './onboarding/GoalsSelection';
import ContactInfo from './onboarding/ContactInfo';

const OnboardingStepper = ({ onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, successMessage, profileStatus } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    interests: [],
    profilePhoto: null,
    goals: [],
    mobileNumber: ''
  });
  
  const totalSteps = 5;
  
  // Clear messages when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);
  
  // Redirect if profile is already complete
  useEffect(() => {
    if (successMessage && !loading && !error) {
      // Delay navigation slightly to show success message
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, loading, error, navigate]);
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit all data
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    // Format data according to API expectations
    const submissionData = {
      role: formData.role,
      interests: formData.interests,
      goals: formData.goals,
      profilePhoto: formData.profilePhoto,
      mobileNumber: formData.mobileNumber
    };
    
    // Call the onComplete function passed from parent
    if (onComplete) {
      onComplete(submissionData);
    }
  };
  
  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: // Role selection
        return !formData.role;
      case 2: // Interests
        return formData.interests.length === 0;
      case 3: // Photos
        return false; // Photos are optional
      case 4: // Goals
        return formData.goals.length === 0;
      case 5: // Contact Info
        return false; // Phone number is optional
      default:
        return false;
    }
  };
  
  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection 
            selectedRole={formData.role}
            onChange={(role) => updateFormData('role', role)}
          />
        );
      case 2:
        return (
          <InterestsSelection
            selectedInterests={formData.interests}
            onChange={(interests) => updateFormData('interests', interests)}
          />
        );
      case 3:
        return (
          <ProfilePhotos
            photo={formData.profilePhoto}
            onChange={(photo) => updateFormData('profilePhoto', photo)}
          />
        );
      case 4:
        return (
          <GoalsSelection
            selectedGoals={formData.goals}
            onChange={(goals) => updateFormData('goals', goals)}
          />
        );
      case 5:
        return (
          <ContactInfo
            mobileNumber={formData.mobileNumber}
            onChange={(number) => updateFormData('mobileNumber', number)}
          />
        );
      default:
        return null;
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Error and success messages */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Current step content */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {loading ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : (
          renderStep()
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="secondary"
          disabled={currentStep === 1 || loading}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          variant="primary"
          disabled={isNextDisabled() || loading}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStepper;