import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Don't send password back
    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      receiveUpdates: user.receiveUpdates,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin
    };
    
    return NextResponse.json(
      { success: true, user: userWithoutPassword, token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}