import React from 'react';
import { useDispatch } from 'react-redux';
import { loginWithGoogle, loginWithApple, loginWithLinkedIn } from '../features/auth/authSlice';

const OAuthButtons = ({ mode = 'login' }) => {
  const dispatch = useDispatch();
  
  const handleGoogleAuth = async () => {
    try {
      await dispatch(loginWithGoogle()).unwrap();
    } catch (error) {
      console.error('Google authentication failed:', error);
    }
  };

  const handleAppleAuth = async () => {
    try {
      await dispatch(loginWithApple()).unwrap();
    } catch (error) {
      console.error('Apple authentication failed:', error);
    }
  };

  const handleLinkedInAuth = async () => {
    try {
      await dispatch(loginWithLinkedIn()).unwrap();
    } catch (error) {
      console.error('LinkedIn authentication failed:', error);
    }
  };

  return (
    <div className="flex space-x-4 justify-start">
      {/* Google button */}
      <button 
        onClick={handleGoogleAuth}
        className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
        <span className="ml-2 font-sans text-sm">Google</span>
      </button>
      
      {/* Apple button */}
      <button 
        onClick={handleAppleAuth}
        className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
        </svg>
        <span className="ml-2 font-sans text-sm">Apple</span>
      </button>
      
      {/* LinkedIn button */}
      <button 
        onClick={handleLinkedInAuth}
        className="w-40 h-12 rounded-md border border-gray-300 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
          <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/>
        </svg>
        <span className="ml-2 font-sans text-sm">LinkedIn</span>
      </button>
    </div>
  );
};

export default OAuthButtons;