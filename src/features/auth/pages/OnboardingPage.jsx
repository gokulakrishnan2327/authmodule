import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnboardingStepper from '../../../components/OnboardingStepper';
import AuthLayout from '../../../layouts/AuthLayout';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, emailVerified, profileStatus } = useSelector((state) => state.auth);

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

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's set up your profile to get the most out of our platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <OnboardingStepper />
        </div>
      </div>
    </AuthLayout>
  );
};

export default OnboardingPage;