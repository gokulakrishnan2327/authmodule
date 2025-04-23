import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authAPI from './authAPI';

// Define types for our state
interface User {
  id: string;
  fullName: string;
  email: string;
  profileStatus?: 'complete' | 'incomplete';
  emailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  profileStatus: 'complete' | 'incomplete';
  emailVerified: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  email?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

// Async thunks
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: string }
>(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginWithGoogle();
      // Check if it's a redirect response, in which case we don't need to handle it
      if ((response as { redirecting: boolean }).redirecting) {
        // This will actually never happen since we redirect the page
        throw new Error('Redirecting to Google OAuth');
      }
      return response as { user: User; token: string };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Google login failed');
    }
  }
);

export const loginWithApple = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: string }
>(
  'auth/loginWithApple',
  async (_, { rejectWithValue }) => {
    try {
      // Implement Apple OAuth login logic
      // For now, let's simulate with a placeholder
      const response = await new Promise<{ data: LoginResponse }>((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'mock-apple-token',
              user: {
                id: 'apple-user-123',
                fullName: 'Apple User',
                email: 'apple-user@example.com',
                profileStatus: 'incomplete',
                emailVerified: true
              }
            }
          });
        }, 1000);
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Apple login failed');
    }
  }
);

export const loginWithLinkedIn = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: string }
>(
  'auth/loginWithLinkedIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginWithLinkedIn();
      if ((response as { redirecting: boolean }).redirecting) {
        throw new Error('Redirecting to LinkedIn OAuth');
      }
      return response as { user: User; token: string };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'LinkedIn login failed');
    }
  }
);

export const handleLoginSuccess = (state: AuthState, action: PayloadAction<LoginResponse>) => {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.profileStatus = action.payload.user?.profileStatus || 'incomplete';
  state.emailVerified = action.payload.user?.emailVerified || false;
  state.isAuthenticated = true;
  localStorage.setItem('token', action.payload.token);
  localStorage.setItem('profileStatus', action.payload.user?.profileStatus || 'incomplete');
};

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string; fullName?: string },
  { rejectValue: string }
>(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const verifyEmail = createAsyncThunk<
  any,
  { email: string; code: string },
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async (verificationData, { rejectWithValue }) => {
    try {
      // Pass the entire object to authAPI
      const response = await authAPI.verifyEmail(verificationData);
      console.log('In thunk:', verificationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Email verification failed');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  { email: string },
  string,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const resetPassword = createAsyncThunk<
  any,
  ResetPasswordPayload,
  { rejectValue: string }
>(
  'auth/reset-Password',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const changePassword = createAsyncThunk<
  any,
  PasswordChangePayload,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.changePassword(currentPassword, newPassword);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

export const logout = createAsyncThunk<
  null,
  void,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (auth.token) {
        await authAPI.logout();
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

interface OnboardingData {
  [key: string]: string | File | string[] | boolean | number;
  profilePhoto?: File;
}

export const completeOnboarding = createAsyncThunk<
  { user?: User },
  OnboardingData,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/completeOnboarding',
  async (onboardingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.completeOnboarding(onboardingData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Onboarding failed');
    }
  }
);

export const updateProfile = async (token: string, profileData: any) => {
  return (window as any).api.post('/update-profile', { token, profileData });
};

export const getCurrentUser = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.getUserProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  profileStatus: (localStorage.getItem('profileStatus') as 'complete' | 'incomplete') || 'incomplete',
  emailVerified: false,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      state.isAuthenticated = true;
    },
    setProfileStatus: (state, action: PayloadAction<'complete' | 'incomplete'>) => {
      state.profileStatus = action.payload;
      localStorage.setItem('profileStatus', action.payload);
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.emailVerified = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{
      user: User;
      token: string;
      profileStatus?: 'complete' | 'incomplete';
      emailVerified?: boolean;
    }>) => {
      const { user, token, profileStatus, emailVerified } = action.payload;
      state.user = user;
      state.token = token;
      state.profileStatus = profileStatus || 'incomplete';
      state.emailVerified = emailVerified || false;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('profileStatus', profileStatus || 'incomplete');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.profileStatus = action.payload.user?.profileStatus || 'incomplete';
        state.emailVerified = action.payload.user?.emailVerified || false;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', action.payload.user?.profileStatus || 'incomplete');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.profileStatus = action.payload.user?.profileStatus || 'incomplete';
        state.emailVerified = action.payload.user?.emailVerified || false;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', action.payload.user?.profileStatus || 'incomplete');
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Google login failed';
      })
      
      // Apple login
      .addCase(loginWithApple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithApple.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.profileStatus = action.payload.user?.profileStatus || 'incomplete';
        state.emailVerified = action.payload.user?.emailVerified || false;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', action.payload.user?.profileStatus || 'incomplete');
      })
      .addCase(loginWithApple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Apple login failed';
      })
      
      // LinkedIn login
      .addCase(loginWithLinkedIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithLinkedIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.profileStatus = action.payload.user?.profileStatus || 'incomplete';
        state.emailVerified = action.payload.user?.emailVerified || false;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', action.payload.user?.profileStatus || 'incomplete');
      })
      .addCase(loginWithLinkedIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'LinkedIn login failed';
      })
      
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        // Safely access user data or set defaults
        state.user = action.payload.user || null;
        state.token = action.payload.token;
        // Set default profileStatus if not provided by API
        state.profileStatus = 'incomplete';
        state.emailVerified = true; // Since we've already verified email in previous step
        state.isAuthenticated = true;
        state.successMessage = 'Account created successfully!';
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', 'incomplete');
        // Clear the signupEmail from localStorage since we don't need it anymore
        localStorage.removeItem('signupEmail');
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      
      // Email verification
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerified = true;
        state.successMessage = 'Email verified successfully!';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Email verification failed';
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileStatus = action.payload.user?.profileStatus || state.profileStatus;
        state.emailVerified = action.payload.user?.emailVerified || state.emailVerified;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get user profile';
        // If we can't get the user profile, we should log the user out
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('profileStatus');
      })
      
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Password reset link sent successfully';
        state.email = action.payload?.email || ''; // Safely access email or set empty
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Password reset successfully! You can now login.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password reset failed';
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Password changed successfully!';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password change failed';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.profileStatus = 'incomplete';
        state.emailVerified = false;
        localStorage.removeItem('token');
        localStorage.removeItem('profileStatus');
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.profileStatus = 'incomplete';
        state.emailVerified = false;
        localStorage.removeItem('token');
        localStorage.removeItem('profileStatus');
      })
      
      // Complete onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.profileStatus = 'complete';
        state.successMessage = 'Onboarding completed successfully!';
        localStorage.setItem('profileStatus', 'complete');
         // Update user data if returned from API
         if (action.payload?.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Onboarding failed';
      });
  },
});

export const { clearError, clearSuccessMessage, setToken, setCredentials, setProfileStatus, setEmailVerified } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectProfileStatus = (state: { auth: AuthState }) => state.auth.profileStatus;
export const selectEmailVerified = (state: { auth: AuthState }) => state.auth.emailVerified;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;