import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get all documents for a user
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
    
    const documents = await Document.find({ userId }).sort({ updatedAt: -1 });
    
    return NextResponse.json(
      { success: true, documents },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create new document collection for a loan application
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
    const { loanInfoId, documents } = data;
    
    // Verify the loan info exists and belongs to the user
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Check if documents already exist for this loan
    const existingDocuments = await Document.findOne({ loanInfoId, userId });
    if (existingDocuments) {
      return NextResponse.json(
        { success: false, message: 'Documents already exist for this loan application' },
        { status: 400 }
      );
    }
    
    // Create new document collection
    const newDocuments = await Document.create({
      loanInfoId,
      userId,
      documents: documents || [],
      status: 'pending'
    });
    
    return NextResponse.json(
      { success: true, documents: newDocuments },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create documents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}