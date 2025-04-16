import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    const { fullName, email, phone, password, receiveUpdates = false, agreeTerms = false } = await request.json();
    
    // Validate terms agreement
    if (!agreeTerms) {
      return NextResponse.json(
        { success: false, message: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Create new user with all fields
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      receiveUpdates,
      agreedToTerms: agreeTerms,
      termsAgreedAt: new Date(),
      status: 'active',
      lastLogin: new Date()
    });
    
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
      agreedToTerms: user.agreedToTerms,
      termsAgreedAt: user.termsAgreedAt,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    };
    
    return NextResponse.json(
      { success: true, user: userWithoutPassword, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}