import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../../components/SignupForm';
import AuthLayout from '../../../layouts/AuthLayout';

const SignupPage = () => {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
       
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;