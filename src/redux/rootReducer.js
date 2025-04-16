// src/redux/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers as your app grows
});

export default rootReducer;