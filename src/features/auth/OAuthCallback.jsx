// src/features/auth/OAuthCallback.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { setCredentials } from './authSlice';
import authAPI from './authAPI';

const OAuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { provider } = useParams();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
  
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
  
        if (!code) throw new Error('Authorization code not found in the callback URL');
  
        const response = await authAPI.handleOAuthCallback(provider, code, state);
  
        if (isMounted && response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('profileStatus', response.user?.profileStatus || 'incomplete');
  
          dispatch(setCredentials({
            user: response.user,
            token: response.token,
            profileStatus: response.user?.profileStatus || 'incomplete',
            emailVerified: response.user?.emailVerified || false
          }));
  
          navigate(response.user?.profileStatus === 'complete' ? '/dashboard' : '/onboarding');
        }
      } catch (err) {
        if (isMounted) {
          console.error('OAuth callback error:', err);
          setError(err.message || 'Authentication failed');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    handleCallback();
  
    return () => {
      isMounted = false;
    };
  }, [dispatch, location.search, navigate, provider]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => navigate('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Authentication successful. Redirecting...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;