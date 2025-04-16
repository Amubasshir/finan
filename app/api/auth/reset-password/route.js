import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { token, password } = await request.json();
    
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Password reset token is invalid or has expired' },
        { status: 400 }
      );
    }
    
    // Set new password
    user.password = password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}