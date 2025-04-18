// src/features/auth/authAPI.js
import axios from 'axios';

// Base API URL
const API_URL = '/api/auth';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('profileStatus');
      // You could dispatch a logout action here or redirect
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const signup = async (userData) => {
  try {
    return await api.post('/signup', userData);
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  return api.post('/login', credentials);
};

export const verifyEmail = async (token) => {
  return api.post('/verify-email', { token });
};

export const resendVerification = async (email) => {
  return api.post('/resend-verification', { email });
};

export const forgotPassword = async (email) => {
  return api.post('/forgot-password', { email });
};

export const resetPassword = async (token, newPassword) => {
  return api.post('/reset-password', { token, newPassword });
};

export const changePassword = async (currentPassword, newPassword) => {
  return api.put('/change-password', { currentPassword, newPassword });
};

export const logout = async () => {
  return api.post('/logout');
};

export const completeOnboarding = async (onboardingData) => {
  try {
    const formData = new FormData();
    
    // Convert onboardingData to FormData for file uploads
    Object.keys(onboardingData).forEach(key => {
      if (key === 'profilePhoto' && onboardingData[key] instanceof File) {
        formData.append(key, onboardingData[key]);
      } else if (Array.isArray(onboardingData[key])) {
        onboardingData[key].forEach(value => {
          formData.append(`${key}[]`, value);
        });
      } else {
        formData.append(key, onboardingData[key]);
      }
    });
    
    const response = await api.post('/onboarding', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
        // 'Authorization': `Bearer ${token}`
    });
    
    return response.data;
  } catch (error) {
    console.error('Onboarding API error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  return api.get('/profile');
};


const authAPI = {
    // Sign up with email
    signup: async (userData) => {
      const response = await api.post('/signup', userData);
      return response.data;
    },
  
    // Login with email and password
    login: async (credentials) => {
      const response = await api.post('/login', credentials);
      return response.data;
    },
  
    // Mock Google OAuth login
    loginWithGoogle: async () => {
      // In a real app, this would redirect to Google OAuth
      // Here we'll simulate a successful social login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      return {
        token: 'mock-google-token',
        user: {
          id: 'google-user-123',
          fullName: 'Google User',
          email: 'google-user@example.com',
          profileStatus: 'incomplete',
          emailVerified: true
        }
      };
    },
  
    // Mock LinkedIn OAuth login
    loginWithLinkedIn: async () => {
      // In a real app, this would redirect to LinkedIn OAuth
      // Here we'll simulate a successful social login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      return {
        token: 'mock-linkedin-token',
        user: {
          id: 'linkedin-user-123',
          fullName: 'LinkedIn User',
          email: 'linkedin-user@example.com',
          profileStatus: 'incomplete',
          emailVerified: true
        }
      };
    },
  
    // Verify email with token
    verifyEmail: async (token) => {
      const response = await api.post('/verify-email', { token });
      return response.data;
    },
  
    // Resend verification email
    resendVerificationEmail: async (email) => {
      const response = await api.post('/resend-verification', { email });
      return response.data;
    },
  
    // Forgot password - request reset link
    forgotPassword: async (email) => {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    },
  
    // Reset password with token
    resetPassword: async (token, password) => {
      const response = await api.post('/reset-password', { token, password });
      return response.data;
    },
  
    // Change password (for logged in users)
    changePassword: async (token, currentPassword, newPassword) => {
      const response = await api.post('/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    },
  
    // Update user profile during onboarding
    updateProfile: async (token, profileData) => {
      const response = await api.post('/onboarding', profileData);
      return response.data;
    },
  
    // Logout user
    logout: async (token) => {
      const response = await api.post('/logout');
      return response.data;
    },
  
    // Check authentication status
    checkAuthStatus: async (token) => {
      const response = await api.get('/status');
      return response.data;
    }
  };
  
  export default authAPI;