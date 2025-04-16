import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get user ID from token
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find user by ID
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    // Get user ID from token
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get update data from request
    const updateData = await request.json();
    
    // Fields that are allowed to be updated
    const allowedFields = ['fullName', 'phone', 'receiveUpdates', 'address', 'employmentDetails'];
    
    // Filter out fields that are not allowed to be updated
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}