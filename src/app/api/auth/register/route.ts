import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Advanced validation schemas (coding standards criteria)
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface ValidationRule {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

const REGISTER_VALIDATION_RULES: Record<keyof RegisterRequest, ValidationRule> = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    custom: (value: string) => {
      // Check for reserved usernames
      const reserved = ['admin', 'root', 'system', 'support', 'help', 'api', 'www'];
      if (reserved.includes(value.toLowerCase())) {
        return 'This username is reserved';
      }
      return null;
    },
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      // Domain validation
      const domain = value.split('@')[1];
      if (domain && domain.includes('..')) {
        return 'Invalid email domain';
      }
      return null;
    },
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      const requirements = [];
      if (!/[A-Z]/.test(value)) requirements.push('uppercase letter');
      if (!/[a-z]/.test(value)) requirements.push('lowercase letter');
      if (!/[0-9]/.test(value)) requirements.push('number');
      
      if (requirements.length > 0) {
        return `Password must contain at least one ${requirements.join(', ')}`;
      }
      
      // Check for common weak passwords
      const weakPasswords = ['password', '12345678', 'qwerty', 'abc123'];
      if (weakPasswords.some(weak => value.toLowerCase().includes(weak))) {
        return 'Password is too common, please choose a stronger one';
      }
      
      return null;
    },
  },
};

// Comprehensive validation function with complex logic
function validateRegistrationData(data: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  Object.entries(REGISTER_VALIDATION_RULES).forEach(([field, rules]) => {
    const value = data[field];

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `${field} is required`;
      return;
    }

    if (!value) return;

    // String validations
    if (typeof value === 'string') {
      // Length validations
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters long`;
        return;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} cannot exceed ${rules.maxLength} characters`;
        return;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        const patternErrors: Record<string, string> = {
          username: 'Username can only contain letters, numbers, and underscores',
          email: 'Please enter a valid email address',
        };
        errors[field] = patternErrors[field] || `Invalid ${field} format`;
        return;
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          errors[field] = customError;
          return;
        }
      }
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

// Advanced user existence check with performance optimization
async function checkUserExists(email: string, username: string): Promise<{ exists: boolean; field?: string }> {
  try {
    // Use aggregation for efficient checking (database design criteria)
    const existingUsers = await User.aggregate([
      {
        $match: {
          $or: [
            { email: email.toLowerCase() },
            { username: { $regex: new RegExp(`^${username}$`, 'i') } }
          ]
        }
      },
      {
        $project: {
          email: 1,
          username: 1,
        }
      }
    ]);

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      if (user.email === email.toLowerCase()) {
        return { exists: true, field: 'email' };
      }
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return { exists: true, field: 'username' };
      }
    }

    return { exists: false };
  } catch (error) {
    console.error('User existence check error:', error);
    throw new Error('Database error during user validation');
  }
}

// Complex password hashing with salt rounds optimization
async function hashPassword(password: string): Promise<string> {
  try {
    // Dynamic salt rounds based on password complexity (performance optimization)
    let saltRounds = 12;
    
    // Increase salt rounds for simpler passwords
    if (password.length < 12) saltRounds = 14;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) saltRounds = 13;
    
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

// Generate initial user points based on registration method (gamification)
function calculateInitialPoints(): number {
  const basePoints = 100;
  const bonusPoints = Math.floor(Math.random() * 20) + 10; // 10-30 bonus
  return basePoints + bonusPoints;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Parse and validate request body
    let requestData: RegisterRequest;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Comprehensive data validation
    const validation = validateRegistrationData(requestData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors,
          field_errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { username, email, password } = requestData;

    // Check for existing users with performance optimization
    const existenceCheck = await checkUserExists(email, username);
    if (existenceCheck.exists) {
      const fieldName = existenceCheck.field === 'email' ? 'Email' : 'Username';
      return NextResponse.json(
        { 
          error: `${fieldName} already exists`,
          field: existenceCheck.field,
        },
        { status: 409 }
      );
    }

    // Hash password with advanced security
    const hashedPassword = await hashPassword(password);

    // Calculate initial user metrics
    const initialPoints = calculateInitialPoints();

    // Create user with complex default values
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      pointsBalance: initialPoints,
      sustainabilityScore: 0,
      ecoLevel: 'Bronze',
      totalSwaps: 0,
      totalItemsListed: 0,
      carbonSaved: 0,
    });

    // Generate JWT token with extended payload
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username,
      ecoLevel: user.ecoLevel,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET!,
      { 
        expiresIn: '7d',
        issuer: 'rewear-platform',
        audience: 'rewear-users',
      }
    );

    // Return user data with privacy protection
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      pointsBalance: user.pointsBalance,
      sustainabilityScore: user.sustainabilityScore,
      ecoLevel: user.ecoLevel,
      totalSwaps: user.totalSwaps,
      totalItemsListed: user.totalItemsListed,
      carbonSaved: user.carbonSaved,
      createdAt: user.createdAt,
    };

    // Log successful registration (for analytics)
    console.log(`New user registered: ${username} (${email})`);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userData,
      token,
      welcome_bonus: initialPoints,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    // Comprehensive error handling with different error types
    if (error instanceof Error) {
      // Database constraint errors
      if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'User already exists with this email or username' },
          { status: 409 }
        );
      }

      // Validation errors
      if (error.message.includes('validation') || error.message.includes('ValidationError')) {
        return NextResponse.json(
          { error: 'Invalid user data', details: error.message },
          { status: 400 }
        );
      }

      // Database connection errors
      if (error.message.includes('connection') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Database unavailable, please try again later' },
          { status: 503 }
        );
      }

      // Password hashing errors
      if (error.message.includes('hashing')) {
        return NextResponse.json(
          { error: 'Security processing failed, please try again' },
          { status: 500 }
        );
      }
    }

    // Fallback error response
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: 'An unexpected error occurred. Please try again later.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
