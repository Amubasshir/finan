// Update import statements
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';  // Remove curly braces
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get a specific loan info
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const loanInfo = await LoanInfo.findOne({ _id: id, userId });
    
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, loanInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const updateData = await request.json();
    
    const updatedLoanInfo = await LoanInfo.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedLoanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, loanInfo: updatedLoanInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const deletedLoanInfo = await LoanInfo.findOneAndDelete({ _id: id, userId });
    
    if (!deletedLoanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Loan info deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}