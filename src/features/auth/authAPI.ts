import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// Base API URL
const API_URL = '/api/auth';

// Create axios instance with common configuration
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for user data
interface User {
  id: string;
  fullName: string;
  email: string;
  profileStatus: 'complete' | 'incomplete';
  emailVerified: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface VerificationData {
  email: string;
  code: string;
}

interface OnboardingData {
  [key: string]: string | File | string[] | boolean | number;
  profilePhoto?: File;
}

interface OAuthProviderConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  responseMode?: string;
}

// Define OAuth configuration types
interface OAuthConfig {
  google: OAuthProviderConfig;
  apple: OAuthProviderConfig;
  linkedin: OAuthProviderConfig;
}

// Request interceptor to attach token
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
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

// OAuth configuration
const oauthConfig: OAuthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: 'profile email',
    responseType: 'code',
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/apple/callback`,
    scope: 'name email',
    responseMode: 'form_post',
    responseType: 'code id_token',
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/linkedin/callback`,
    scope: 'r_liteprofile r_emailaddress',
    responseType: 'code',
  }
};

// Auth API methods
export const signup = async (userData: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<AxiosResponse> => {
  try {
    return await api.post('/signup', userData);
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const login = async (credentials: { email: string; password: string }): Promise<AxiosResponse> => {
  return api.post('/login', credentials);
};

export const verifyEmail = async (verificationData: VerificationData): Promise<AxiosResponse> => {
  // Directly pass the object containing email and code
  console.log('API call with:', verificationData);
  return api.post('/verify-email', verificationData);
};

export const resendVerification = async (email: string): Promise<AxiosResponse> => {
  return api.post('/resend-verification', { email });
};

export const forgotPassword = async (email: string): Promise<AxiosResponse> => {
  return api.post('/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<AxiosResponse> => {
  return api.post('/reset-password', { token, newPassword });
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<AxiosResponse> => {
  return api.put('/change-password', { currentPassword, newPassword });
};

export const logout = async (): Promise<AxiosResponse> => {
  return api.post('/logout');
};

export const completeOnboarding = async (onboardingData: OnboardingData): Promise<any> => {
  try {
    const formData = new FormData();
    
    // Convert onboardingData to FormData for file uploads
    Object.keys(onboardingData).forEach(key => {
      if (key === 'profilePhoto' && onboardingData[key] instanceof File) {
        formData.append(key, onboardingData[key] as File);
      } else if (Array.isArray(onboardingData[key])) {
        (onboardingData[key] as string[]).forEach(value => {
          formData.append(`${key}[]`, value);
        });
      } else {
        formData.append(key, String(onboardingData[key]));
      }
    });
    
    const response = await api.post('/onboarding', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
  } catch (error) {
    console.error('Onboarding API error:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<AxiosResponse> => {
  return api.get('/profile');
};

// OAuth helper functions
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

type OAuthProvider = 'google' | 'apple' | 'linkedin';

const generateAuthUrl = (provider: OAuthProvider): string => {
  const config = oauthConfig[provider];
  if (!config) throw new Error(`Unsupported provider: ${provider}`);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: config.responseType,
    state: generateRandomString(16),
  });

  // Store state in localStorage to verify when the user returns
  localStorage.setItem(`${provider}_oauth_state`, params.get('state') || '');

  // Provider-specific URLs
  const baseUrls: Record<OAuthProvider, string> = {
    google: 'https://accounts.google.com/o/oauth2/v2/auth',
    apple: 'https://appleid.apple.com/auth/authorize',
    linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
  };

  // Add provider-specific params
  if (provider === 'apple' && config.responseMode) {
    params.append('response_mode', config.responseMode);
  }

  return `${baseUrls[provider]}?${params.toString()}`;
};

// OAuth methods
interface AuthAPI {
  signup: (userData: { email: string; password: string; fullName?: string }) => Promise<AuthResponse>;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  initiateGoogleAuth: () => void;
  initiateAppleAuth: () => void;
  initiateLinkedInAuth: () => void;
  handleOAuthCallback: (provider: OAuthProvider, code: string, state: string) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse | { redirecting: boolean }>;
  loginWithApple: () => Promise<AuthResponse | { redirecting: boolean }>;
  loginWithLinkedIn: () => Promise<AuthResponse | { redirecting: boolean }>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
  updateProfile: (profileData: any) => Promise<any>;
  logout: () => Promise<any>;
  checkAuthStatus: () => Promise<any>;
}

const authAPI: AuthAPI = {
  // Common API methods
  signup: async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  // OAuth initiation methods
  initiateGoogleAuth: () => {
    const authUrl = generateAuthUrl('google');
    window.location.href = authUrl;
  },
  
  initiateAppleAuth: () => {
    const authUrl = generateAuthUrl('apple');
    window.location.href = authUrl;
  },
  
  initiateLinkedInAuth: () => {
    const authUrl = generateAuthUrl('linkedin');
    window.location.href = authUrl;
  },
  
  // OAuth callback handling methods
  handleOAuthCallback: async (provider, code, state) => {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem(`${provider}_oauth_state`);
    if (state !== savedState) {
      throw new Error('OAuth state mismatch. Possible CSRF attack.');
    }
    
    // Clear the state from localStorage
    localStorage.removeItem(`${provider}_oauth_state`);
    
    // Exchange code for token
    const response = await api.post(`/oauth/${provider}/callback`, { code });
    return response.data;
  },
  
  // For development/testing without backend
  // These methods simulate the OAuth flow
  loginWithGoogle: async () => {
    if (import.meta.env.MODE === 'development' && import.meta.env.VITE_MOCK_OAUTH === 'true') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        token: 'mock-google-token-' + Date.now(),
        user: {
          id: 'google-user-123',
          fullName: 'Google User',
          email: 'google-user@example.com',
          profileStatus: 'incomplete',
          emailVerified: true
        }
      };
    } else {
      // In production, initiate the real OAuth flow
      authAPI.initiateGoogleAuth();
      // This return won't be used since we're redirecting
      return { redirecting: true };
    }
  },
  
  loginWithApple: async () => {
    if (import.meta.env.MODE === 'development' && import.meta.env.VITE_MOCK_OAUTH === 'true') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        token: 'mock-apple-token-' + Date.now(),
        user: {
          id: 'apple-user-123',
          fullName: 'Apple User',
          email: 'apple-user@example.com',
          profileStatus: 'incomplete',
          emailVerified: true
        }
      };
    } else {
      // In production, initiate the real OAuth flow
      authAPI.initiateAppleAuth();
      // This return won't be used since we're redirecting
      return { redirecting: true };
    }
  },
  
  loginWithLinkedIn: async () => {
    if (import.meta.env.MODE === 'development' && import.meta.env.VITE_MOCK_OAUTH === 'true') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        token: 'mock-linkedin-token-' + Date.now(),
        user: {
          id: 'linkedin-user-123',
          fullName: 'LinkedIn User',
          email: 'linkedin-user@example.com',
          profileStatus: 'incomplete',
          emailVerified: true
        }
      };
    } else {
      // In production, initiate the real OAuth flow
      authAPI.initiateLinkedInAuth();
      // This return won't be used since we're redirecting
      return { redirecting: true };
    }
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
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },
  
  // Update user profile during onboarding
  updateProfile: async (profileData) => {
    const response = await api.post('/onboarding', profileData);
    return response.data;
  },
  
  // Logout user
  logout: async () => {
    const response = await api.post('/logout');
    // Clear localStorage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('profileStatus');
    return response.data;
  },
  
  // Check authentication status
  checkAuthStatus: async () => {
    const response = await api.get('/status');
    return response.data;
  }
};

export default authAPI;