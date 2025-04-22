import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearSuccessMessage } from '../authSlice';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    // Dispatch the forgotPassword action and store the result
    const resultAction = await dispatch(forgotPassword({ email }));
    
    // If the action was fulfilled (successful), navigate to the check-mail page
    if (forgotPassword.fulfilled.match(resultAction)) {
      navigate('/auth/check-mail');
    }
  };
  
  const handleTryAgain = () => {
    setEmail('');
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };
  
  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto text-left mt-10" style={{ height: "480px" }}>
        <div className="mb-2 h-20 text-left">
          <h1 className="font-roboto text-3xl font-semibold leading-relaxed tracking-tighter text-left text-[#2D3436]">
            Forgot your password?
          </h1>
          <p className="text-[#454551] mt-1.5 font-roboto text-left text-base font-medium tracking-wide leading-6">
            Enter the email address you used when you joined and we'll send you instructions to reset your password.
          </p>
        </div>
        <div className="mt-10 w-full text-left">
          <div className="bg-white py-8 px-0 text-left">
            {loading && (
              <div className="flex justify-start my-6">
                <Loader />
              </div>
            )}
            
            {!loading && error && (
              <div className="bg-red-50 p-4 rounded-md mb-6 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-red-800 leading-5">{error}</p>
                  </div>
                </div>
                <div className="mt-4 text-left">
                  <Button onClick={handleTryAgain} variant="secondary" size="sm">
                    Try again
                  </Button>
                </div>
              </div>
            )}
            
            {!loading && !error && (
              <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                <div className="text-left">
                  <label htmlFor="email" className="block text-sm font-medium font-bold text-gray-700 text-left font-roboto mb-2">
                    Email address
                  </label>
                  <div className="text-left">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Example@Youremail.com"
                    />
                  </div>
                </div>
                
                {/* Button with left alignment */}
                <div className="mt-8 text-left">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={!email.trim() || loading}
                    className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-10 text-left"
                  >
                    <span className="mx-6 font-large text-left">Send reset link</span>
                  </Button>
                </div>
                
                {/* Back to sign in with explicit left alignment */}
                <div className="mt-8 text-left">
                  <p className="font-roboto text-sm tracking-wider text-[#64646D] leading-6 text-left">
                    Back to{' '}
                    <Link 
                      to="/auth/login" 
                      className="text-[#5D40ED] font-roboto font-bold tracking-wider inline-block"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;