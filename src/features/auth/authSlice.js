// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from './authAPI';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Signup failed' });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Email verification failed' });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Password reset request failed' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Password reset failed' });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.changePassword(currentPassword, newPassword, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Password change failed' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (auth.token) {
        await authAPI.logout(auth.token);
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout failed' });
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (onboardingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.completeOnboarding(onboardingData, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Onboarding failed' });
    }
  }
);

// Update profile
export const updateProfile = async (token, profileData) => {
    return api.post('/update-profile', { token, profileData });
  };
  
  // Get current user
  export const getCurrentUser = async (token) => {
    return api.get('/me');
  }
//redirect to dashboard directly without login
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  profileStatus: localStorage.getItem('profileStatus') || 'incomplete',
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
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      state.isAuthenticated = true;
    },
    setProfileStatus: (state, action) => {
      state.profileStatus = action.payload;
      localStorage.setItem('profileStatus', action.payload);
    },
    setEmailVerified: (state, action) => {
      state.emailVerified = action.payload;
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
        state.profileStatus = action.payload.user.profileStatus || 'incomplete';
        state.emailVerified = action.payload.user.emailVerified || false;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', action.payload.user.profileStatus || 'incomplete');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.profileStatus = 'incomplete';
        state.emailVerified = false;
        state.isAuthenticated = true;
        state.successMessage = 'Account created successfully! Please verify your email.';
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileStatus', 'incomplete');
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Signup failed';
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
        state.error = action.payload?.message || 'Email verification failed';
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
        state.email = action.payload.email; // Store the email
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
        state.error = action.payload?.message || 'Password reset failed';
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
        state.error = action.payload?.message || 'Password change failed';
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
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.loading = false;
        state.profileStatus = 'complete';
        state.successMessage = 'Onboarding completed successfully!';
        localStorage.setItem('profileStatus', 'complete');
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Onboarding failed';
      });
  },
});

export const { clearError, clearSuccessMessage, setToken, setProfileStatus, setEmailVerified } = authSlice.actions;

export default authSlice.reducer;