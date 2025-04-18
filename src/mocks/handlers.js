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
    phoneNumber: '+1234567890',
    countryCode: 'US',
    interests: ['Fintech', 'AI', 'Blockchain'],
    goals: ['Raise Funds', 'Build Network'],
    profilePhotos: [],
    createdAt: new Date().toISOString()
  }
];

// Mock verification codes - in a real app, these would be stored securely
const verificationCodes = new Map();

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

// Generate verification code for email
const generateVerificationCode = (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  verificationCodes.set(email, {
    code,
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0
  });
  return code;
};

export const handlers = [
  // Sign Up (from file 2)
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
      emailVerified: true,
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
  
  // Start Registration - Send verification code (from file 1)
  rest.post('/api/auth/register', (req, res, ctx) => {
    const { email } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email already in use' })
      );
    }
    
    // Generate and store verification code
    const code = generateVerificationCode(email);
    
    console.log(`Verification code for ${email}: ${code}`); // For testing purposes
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Verification code sent successfully',
        email
      })
    );
  }),
  
  // Verify Email Code (from file 1)
  rest.post('/api/auth/verify-email-code', (req, res, ctx) => {
    const { email, code } = req.body;
    
    if (!verificationCodes.has(email)) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'No verification code found for this email' })
      );
    }
    
    const verificationData = verificationCodes.get(email);
    
    // Check if code is expired
    if (new Date() > verificationData.expires) {
      verificationCodes.delete(email);
      return res(
        ctx.status(400),
        ctx.json({ error: 'Verification code expired' })
      );
    }
    
    // Check attempts
    if (verificationData.attempts >= 3) {
      verificationCodes.delete(email);
      return res(
        ctx.status(400),
        ctx.json({ error: 'Too many attempts, please request a new code' })
      );
    }
    
    // Verify code
    if (verificationData.code !== code) {
      verificationData.attempts += 1;
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid verification code' })
      );
    }
    
    // Code is valid
    verificationCodes.delete(email); // Remove the code once used
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Email verified successfully',
        email,
        verified: true
      })
    );
  }),
  
  // Complete Registration - Create user account (from file 1)
  rest.post('/api/auth/complete-registration', (req, res, ctx) => {
    const { email, fullName, password, phoneNumber, countryCode, role } = req.body;
    
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
      phoneNumber,
      countryCode,
      role,
      emailVerified: true, // Since we verified the email in the previous step
      profileStatus: 'complete',
      interests: [],
      goals: [],
      profilePhotos: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate token for auto login
    const token = generateToken(newUser.id);
    
    return res(
      ctx.status(201),
      ctx.json({
        message: 'Registration completed successfully',
        token,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          countryCode: newUser.countryCode,
          role: newUser.role,
          profileStatus: newUser.profileStatus,
          emailVerified: newUser.emailVerified
        }
      })
    );
  }),
  
  // Email Verification (from file 2)
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
  
  // Resend Verification Email (combined from both files)
  rest.post('/api/auth/resend-verification', (req, res, ctx) => {
    const { email } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Generate a new code for new user signup flow
      const code = generateVerificationCode(email);
      console.log(`New verification code for ${email}: ${code}`); // For testing purposes
      
      return res(
        ctx.status(200),
        ctx.json({
          message: 'Verification code resent successfully',
          email
        })
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
  
  // Login (combined from both files)
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
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          role: user.role,
          profileStatus: user.profileStatus,
          emailVerified: user.emailVerified,
          interests: user.interests,
          goals: user.goals
        }
      })
    );
  }),
  
  // Check Auth Status - Validate token and return user info (combined from both files)
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
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          role: user.role,
          profileStatus: user.profileStatus,
          emailVerified: user.emailVerified,
          interests: user.interests,
          goals: user.goals
        }
      })
    );
  }),
  
  // Forgot Password (from file 2)
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
  
  // Reset Password (from file 2)
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
  
  // Change Password (from file 2)
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
  
  // Onboarding - Update user profile (from file 2)
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
          profileStatus: 'complete',
          emailVerified: user.emailVerified,
          role: user.role,
          interests: user.interests,
          goals: user.goals
        }
      })
    );
  }),
  
  // Logout (combined from both files)
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
  })
];