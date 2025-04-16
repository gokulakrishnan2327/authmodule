import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../../components/LoginForm';
import AuthLayout from '../../../layouts/AuthLayout';

const LoginPage = () => {
    console.log("Rendering LoginPage");
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Welcome Back!        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
        You're just one step away from accessing your account
        </p>
      </div>
      <div>
      {/* Sign in with
      create 3 button google,appl,linkdin */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;