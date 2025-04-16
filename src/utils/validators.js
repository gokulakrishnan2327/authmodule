// src/utils/validators.js

// Password validation - minimum 8 characters with at least 1 number
export const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Email validation
  export const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate full name (non-empty and contains at least first and last name)
  export const isFullNameValid = (fullName) => {
    return fullName.trim().length > 0 && fullName.trim().includes(' ');
  };
  
  // Check if passwords match (for password confirmation)
  export const doPasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  // Format validation error messages for forms
  export const getValidationError = (field, value) => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!isEmailValid(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (!isPasswordValid(value)) return 'Password must be at least 8 characters with at least one number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return '';
      case 'fullName':
        if (!value) return 'Full name is required';
        if (!isFullNameValid(value)) return 'Please enter your first and last name';
        return '';
      default:
        return '';
    }
  };
  
  // Token handling helpers
  export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    if (!token) return true;
    
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;
    
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };
  
  // Helper for form validation
  export const validateForm = (formData, fields) => {
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      const error = getValidationError(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    // Special case for password confirmation
    if (fields.includes('password') && fields.includes('confirmPassword')) {
      if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    return { isValid, errors };
  };