import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { selectedLoans, loanInfoId } = await request.json();
    
    if (!selectedLoans || !selectedLoans.length || !loanInfoId) {
      return NextResponse.json(
        { success: false, message: 'Selected loans and loan info ID are required' },
        { status: 400 }
      );
    }
    
    // Verify loan info exists and belongs to user
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Update loan info with selected loans
    loanInfo.selectedLoans = selectedLoans;
    loanInfo.status = 'loan_selected';
    loanInfo.statusUpdatedAt = new Date();
    
    await loanInfo.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Loan selections saved successfully',
        redirectUrl: `/document-collection?id=${loanInfoId}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Select loans error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}