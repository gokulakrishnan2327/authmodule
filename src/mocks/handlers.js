// src/mocks/handlers.js
import { rest } from 'msw';

// Mock user data store
let users = [
  {
    id: '1',
    fullName: 'Demo User',
    email: 'demo@example.com',
    password: 'Password123', // In a real app, passwords would be hashed
    emailVerified: true,
    profileStatus: 'complete',
    role: 'Founder',
    interests: ['Fintech', 'AI', 'Blockchain'],
    goals: ['Raise Funds', 'Build Network'],
    profilePhotos: [],
    createdAt: new Date().toISOString()
  }
];

// Mock tokens store - in a real app, these would be managed securely
const tokens = new Map();

// Helper to generate mock tokens
const generateToken = (userId) => {
  const token = `mock-jwt-${userId}-${Date.now()}`;
  tokens.set(token, {
    userId,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  return token;
};

// Helper to validate token
const validateToken = (token) => {
  if (!tokens.has(token)) return null;
  
  const tokenData = tokens.get(token);
  
  if (new Date() > tokenData.expires) {
    tokens.delete(token);
    return null;
  }
  
  return tokenData;
};

export const handlers = [
  // Sign Up
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { fullName, email, password, referralCode } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email already in use' })
      );
    }
    
    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      fullName,
      email,
      password, // In a real app, this would be hashed
      emailVerified: false,
      profileStatus: 'incomplete',
      referralCode: referralCode || null,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    return res(
      ctx.status(201),
      ctx.json({
        message: 'User created successfully, please verify your email',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          profileStatus: newUser.profileStatus,
          emailVerified: newUser.emailVerified
        }
      })
    );
  }),
  
  // Email Verification
  rest.post('/api/auth/verify-email', (req, res, ctx) => {
    const { token } = req.body;
    
    // In a real app, we would validate the token against stored tokens
    // Here we'll just simulate successful verification
    if (token && token.startsWith('mock-verify-')) {
      const userId = token.split('-')[2];
      const user = users.find(u => u.id === userId);
      
      if (user) {
        user.emailVerified = true;
        return res(
          ctx.status(200),
          ctx.json({
            message: 'Email verified successfully',
            emailVerified: true
          })
        );
      }
    }
    
    return res(
      ctx.status(400),
      ctx.json({ error: 'Invalid or expired verification token' })
    );
  }),
  
  // Resend Verification Email
  rest.post('/api/auth/resend-verification', (req, res, ctx) => {
    const { email } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'User not found' })
      );
    }
    
    if (user.emailVerified) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email already verified' })
      );
    }
    
    // In a real app, would send a new verification email
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Verification email sent successfully'
      })
    );
  }),
  
  // Login
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid email or password' })
      );
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    return res(
      ctx.status(200),
      ctx.json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          profileStatus: user.profileStatus,
          emailVerified: user.emailVerified
        }
      })
    );
  }),
  
  // Forgot Password
  rest.post('/api/auth/forgot-password', (req, res, ctx) => {
    const { email } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // We don't indicate if the email exists or not for security reasons
      return res(
        ctx.status(200),
        ctx.json({
          message: 'If an account with that email exists, a password reset link has been sent'
        })
      );
    }
    
    // In a real app, would send a reset email with token
    return res(
      ctx.status(200),
      ctx.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    );
  }),
  
  // Reset Password
  rest.post('/api/auth/reset-password', (req, res, ctx) => {
    const { token, password } = req.body;
    
    // In a real app, would validate the token and update the user's password
    // Here we'll just simulate success
    if (token && token.startsWith('mock-reset-')) {
      return res(
        ctx.status(200),
        ctx.json({
          message: 'Password reset successfully'
        })
      );
    }
    
    return res(
      ctx.status(400),
      ctx.json({ error: 'Invalid or expired reset token' })
    );
  }),
  
  // Change Password
  rest.post('/api/auth/change-password', (req, res, ctx) => {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Unauthorized' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    const tokenData = validateToken(token);
    
    if (!tokenData) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid or expired token' })
      );
    }
    
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user || user.password !== currentPassword) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Current password is incorrect' })
      );
    }
    
    // Update password
    user.password = newPassword;
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Password changed successfully'
      })
    );
  }),
  
  // Onboarding - Update user profile
  rest.post('/api/auth/onboarding', (req, res, ctx) => {
    const { role, interests, goals, profilePhotos, mobileNumber } = req.body;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Unauthorized' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    const tokenData = validateToken(token);
    
    if (!tokenData) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid or expired token' })
      );
    }
    
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'User not found' })
      );
    }
    
    // Update user profile
    if (role) user.role = role;
    if (interests) user.interests = interests;
    if (goals) user.goals = goals;
    if (profilePhotos) user.profilePhotos = profilePhotos;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    
    // Mark profile as complete
    user.profileStatus = 'complete';
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          profileStatus: user.profileStatus,
          emailVerified: user.emailVerified,
          role: user.role,
          interests: user.interests,
          goals: user.goals
        }
      })
    );
  }),
  
  // Logout
  rest.post('/api/auth/logout', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      tokens.delete(token);
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Logged out successfully'
      })
    );
  }),
  
  // Check Auth Status - Validate token and return user info
  rest.get('/api/auth/status', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Unauthorized' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    const tokenData = validateToken(token);
    
    if (!tokenData) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid or expired token' })
      );
    }
    
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'User not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          profileStatus: user.profileStatus,
          emailVerified: user.emailVerified,
          role: user.role,
          interests: user.interests,
          goals: user.goals
        }
      })
    );
  })
];