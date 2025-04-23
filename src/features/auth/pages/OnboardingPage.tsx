import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnboardingStepper from '../../../components/OnboardingStepper';
import AuthLayout from '../../../layouts/AuthLayout';
import { completeOnboarding } from '../authSlice';
import { RootState, AppDispatch } from '../../../store'; // You'll need to create this type

interface OnboardingFormData {
  // Add the expected properties of your form data
  [key: string]: any;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, emailVerified, profileStatus, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect if not authenticated or email not verified
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else if (!emailVerified) {
      navigate('/auth/verify-email');
    } else if (profileStatus === 'complete') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, emailVerified, profileStatus, navigate]);

  const handleCompleteOnboarding = (formData: OnboardingFormData) => {
    dispatch(completeOnboarding(formData))
      .unwrap()
      .then(() => {
        // Success case will be handled by the useEffect above
      })
      .catch((error) => {
        console.error('Onboarding failed:', error);
        // Don't navigate away - let the user try again
      });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="mt-2 text-lg text-gray-600">
          Let's set up your profile to get the most out of our platform
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <OnboardingStepper onComplete={handleCompleteOnboarding} />
        </div>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 p-4 rounded-md">
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
    </div>
  );
};

export default OnboardingPage;