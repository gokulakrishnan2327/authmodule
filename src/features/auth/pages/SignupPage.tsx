import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../../components/SignupForm';
import AuthLayout from '../../../layouts/AuthLayout';

const SignupPage: React.FC = () => {
  return (
    <AuthLayout>
      <div className="mt-0 mb-8">
        <SignupForm />
      </div>
    </AuthLayout>
  );
};

export default SignupPage;