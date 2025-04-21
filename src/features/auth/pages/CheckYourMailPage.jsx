import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import AuthLayout from '../../../layouts/AuthLayout';

const CheckYourMailPage = () => {
  const { email } = useSelector((state) => state.auth);
  
  const handleOpenEmailApp = () => {
    // Open the user's default email client
    window.location.href = 'mailto:';
  };
  
  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto text-left">
        {/* Email verification illustration with animated paper plane */}
        <div className="flex justify-center mb-4">
          <svg width="180" height="160" viewBox="0 0 294 268" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Paper Rocket */}
            <path d="M292 45.43L49.94 84.17L1 181.23L201.45 210.84L292 45.43Z" fill="white" stroke="#6B63FF" strokeWidth="2"/>
            <path d="M49.94 84.17L201.45 210.84" stroke="#6B63FF" strokeWidth="2"/>
            <path d="M133.94 169.57L292 45.43" stroke="#6B63FF" strokeWidth="2"/>
            <path d="M1 181.23L133.94 169.57" stroke="#6B63FF" strokeWidth="2"/>
            
            {/* Accent color triangle */}
            <path d="M292 45.43L201.45 84.17L243.97 133.43L292 45.43Z" fill="#6B63FF"/>
            
            {/* Security icon */}
            <circle cx="257" cy="74" r="10" fill="white"/>
            <path d="M254 74V70C254 68.34 255.34 67 257 67C258.66 67 260 68.34 260 70V74" stroke="#6B63FF" strokeWidth="2"/>
            <rect x="252" y="73" width="10" height="8" rx="2" fill="white" stroke="#6B63FF" strokeWidth="2"/>
            
            {/* Email envelope */}
            <rect x="68" y="110" width="145" height="100" rx="10" fill="#E6E6FF" stroke="#6B63FF" strokeWidth="2"/>
            <path d="M68 125L140.5 170L213 125" stroke="#6B63FF" strokeWidth="3"/>
            <path d="M213 210L160 160" stroke="#6B63FF" strokeWidth="2"/>
            <path d="M68 210L121 160" stroke="#6B63FF" strokeWidth="2"/>
            
            {/* Decorative motion lines */}
            <path d="M30 220C40 240 70 260 110 240C150 220 170 240 180 260" stroke="#6B63FF" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        {/* Heading section with reduced height */}
        <div className="mb-4 h-18">
          <h1 className="font-roboto text-xl font-semibold leading-tight tracking-tight text-left text-[#2D3436]">
            Check your mail
          </h1>
          <p className="text-[#454551] mt-1 font-roboto text-left text-medium font-medium tracking-normal leading-5">
            We have sent a password recovery instructions to your email.{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <div className="w-full">
          <div className="bg-white py-5 px-4">
            {/* Action button with optimized spacing */}
            <div>
              <Button 
                onClick={handleOpenEmailApp} 
                variant="primary" 
                fullWidth 
                className="bg-[#5E41F1] hover:bg-[#4933c8] font-roboto transition-colors h-11"
              >
                <span className="mx-3 font-medium">Open Email App</span>
              </Button>
            </div>
            
            <div className="mt-6 pt-2">
              <p className="font-roboto text-s tracking-wide text-[#64646D] leading-5">
                Did not receive the email? Check your spam filter, or{' '}
                <Link 
                  to="/auth/forgot-password" 
                  className="text-[#5D40ED] font-roboto font-bold tracking-wide inline-block"
                >
                  try another email address
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckYourMailPage;