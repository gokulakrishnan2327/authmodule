import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../../components/LoginForm';
import AuthLayout from '../../../layouts/AuthLayout';

const LoginPage: React.FC = () => {
  console.log("Rendering LoginPage");
  return (
    <AuthLayout>
      <div className="mt--8 mb-20">
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;