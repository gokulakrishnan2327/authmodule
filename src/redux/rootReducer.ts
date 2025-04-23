// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers as your app grows
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;