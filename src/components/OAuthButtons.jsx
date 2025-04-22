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
      {/* Google button with perfectly centered icon */}
      <button 
        onClick={handleGoogleAuth}
        className="w-40 h-12 rounded-md border border-gray-350 flex items-center justify-center hover:bg-gray-50 transition-colors font-sans">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
          </svg>
        </div>
      </button>
      
      {/* Apple button with centered icon */}
      <button 
        onClick={handleAppleAuth}
        className="w-40 h-12 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-sans">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
          </svg>
        </div>
      </button>
      
      {/* LinkedIn button with centered icon */}
      <button 
        onClick={handleLinkedInAuth}
        className="w-40 h-12 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-sans">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="#0077B5">
            <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default OAuthButtons;