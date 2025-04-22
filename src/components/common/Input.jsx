import React, { useState } from 'react';

const Input = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine border and focus styling based on state
  let borderClass = 'border-[#94949B] focus:border-primary focus:ring-primary';
  if (error) borderClass = 'border-error focus:border-error focus:ring-error';
  if (success) borderClass = 'border-success focus:border-success focus:ring-success';
  
  // Determine padding based on presence of icons
  let paddingClass = 'px-4 py-2'; // 16px horizontal, 8px vertical padding
  if (leadingIcon) paddingClass = 'pl-10 pr-4 py-2';
  if (trailingIcon || type === 'password') paddingClass = 'pl-4 pr-10 py-2';
  if (leadingIcon && (trailingIcon || type === 'password')) paddingClass = 'pl-10 pr-10 py-2';
  
  // Determine actual input type
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={`${className} w-full `}>
      <div className="relative rounded-lg shadow-sm">
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          className={`
            font-roboto font-medium text-base leading-none tracking-wide
            block w-full h-10 border border-solid rounded-lg
            ${paddingClass} ${borderClass} 
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
          placeholder={placeholder}
          disabled={disabled}
        />
        
        {label && (
          <label 
            htmlFor={id} 
            className={`
              absolute text-sm font-roboto font-medium text-[#64646D]
              ${isFocused || value ? 'top-1 left-4 text-xs transition-all duration-200' : 'top-1/2 -translate-y-1/2 left-4'}
              ${leadingIcon ? 'left-10' : ''}
            `}
          >
            {label} {required && <span className="text-error">*</span>}
          </label>
        )}
        
        {type === 'password' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword }
            </button>
          </div>
        )}
        
        {trailingIcon && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{trailingIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      
      {success && !error && (
        <p className="mt-1 text-sm text-success">{success}</p>
      )}
    </div>
  );
};

export default Input;