import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get all loan info for the current user
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
    
    // Find all loan info for the current user
    const loanInfos = await LoanInfo.find({ userId }).sort({ updatedAt: -1 });
    
    return NextResponse.json(
      { success: true, loanInfos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get all loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create a new loan info
export async function POST(request) {
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
    
    const data = await request.json();
    
    // Create new loan info with the user ID
    const newLoanInfo = new LoanInfo({
      ...data,
      userId,
      status: 'draft'
    });
    
    await newLoanInfo.save();
    
    return NextResponse.json(
      { success: true, loanInfo: newLoanInfo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}