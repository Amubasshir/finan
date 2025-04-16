import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await connectDB();
    
    // Verify environment variables are loaded
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('Missing required environment variables');
    }
    
    const { email } = await request.json();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If your email is registered, you will receive a password reset link.' },
        { status: 200 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiry (1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Create reset URL with fallback
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    
    // Configure email transport with error handling
    const transportConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '2525'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true
    };

    console.log('Transport Config:', {
      ...transportConfig,
      auth: { ...transportConfig.auth, pass: '****' } // Hide password in logs
    });
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verify transporter connection
    await transporter.verify();
    
    console.log('Reset URL:', resetUrl);
    
    // Email content
    const mailOptions = {
      from: `"Refii Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Reset Your Password</h2>
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Thanks,<br>The Refii Team</p>
        </div>
      `,
    };
    
    // Send email with better error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      throw new Error('Failed to send password reset email');
    }
    
    return NextResponse.json(
      { success: true, message: 'If your email is registered, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}