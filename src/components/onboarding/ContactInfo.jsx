import React, { useState } from 'react';

const ContactInfo = ({ phoneNumber, onChange }) => {
  const [error, setError] = useState('');
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // Clear previous error
    setError('');
    
    // Basic phone validation (optional)
    if (value && !isValidPhoneNumber(value)) {
      setError('Please enter a valid phone number');
    }
    
    onChange(value);
  };
  
  // Simple phone validation - can be extended for more sophisticated validation
  const isValidPhoneNumber = (phone) => {
    // Allow empty (since it's optional) or minimum 10 digits
    return phone === '' || /^\+?[0-9]{10,15}$/.test(phone.replace(/[\s()-]/g, ''));
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Contact Information</h3>
      <p className="text-gray-600 mb-6">
        Add your phone number to enhance your profile. This is optional but can help with account recovery and verification.
      </p>
      
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="+1 (555) 123-4567"
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Your phone number will be kept private and will only be used for account-related notifications.
        </p>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Why add a phone number?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Account recovery if you lose access to your email
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enhanced security with two-factor authentication
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Important account notifications and updates
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInfo;