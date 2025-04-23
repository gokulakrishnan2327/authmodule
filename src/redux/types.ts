// src/redux/types.ts

// Define the auth state interface
export interface AuthState {
    isAuthenticated: boolean;
    user: any; // Replace with specific user type later
    loading: boolean;
    error: string | null;
    emailVerified: boolean;
    profileStatus: 'complete' | 'incomplete';
    successMessage: string | null;
  }
  
  // This will be refined in rootReducer.ts
  export interface RootState {
    auth: AuthState;
    // Add other slices here
  }