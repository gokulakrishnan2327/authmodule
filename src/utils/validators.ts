// src/utils/validators.ts

// Password validation - minimum 8 characters with at least 1 number
export const isPasswordValid = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Email validation
export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate full name (non-empty and contains at least first and last name)
export const isFullNameValid = (fullName: string): boolean => {
  return fullName.trim().length > 0 && fullName.trim().includes(' ');
};

// Check if passwords match (for password confirmation)
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Define field types for form validation
type FieldName = 'email' | 'password' | 'confirmPassword' | 'fullName';

// Format validation error messages for forms
export const getValidationError = (field: FieldName, value: string): string => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!isEmailValid(value)) return 'Please enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (!isPasswordValid(value)) return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
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
export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// Define types for form data
interface FormData {
  [key: string]: string;
}

// Define return type for validateForm
interface ValidationResult {
  isValid: boolean;
  errors: {
    [key: string]: string;
  };
}

// Helper for form validation
export const validateForm = (formData: FormData, fields: FieldName[]): ValidationResult => {
  const errors: {[key: string]: string} = {};
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