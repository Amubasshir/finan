// Fix the import statement for connectDB
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo'; // This should match the actual filename case
import { verifyToken } from '@/lib/auth';

// Get all loan info for the current user
// Convert exports to proper Next.js route handlers
export async function GET(request) {
  try {
    await connectDB();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const data = await request.json();
    
    // Process financial data if it exists
    if (data?.financial) {
      const numericFields = [
        'monthlyExpenses', 'existingDebts', 'savingsBalance', 
        'investments', 'otherAssets', 'currentMortgage', 
        'currentInterestRate', 'currentLoanTerm', 
        'remainingLoanTerm', 'exitFees'
      ];
      
      numericFields.forEach(field => {
        if (data.financial[field] !== undefined) {
          data.financial[field] = Number(data.financial[field]);
        }
      });
    }

    const newLoanInfo = await LoanInfo.create({
      ...data,
      userId,
      status: 'draft'
    });

    return NextResponse.json(
      { success: true, loanInfo: newLoanInfo ? newLoanInfo.toObject() : null },
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
