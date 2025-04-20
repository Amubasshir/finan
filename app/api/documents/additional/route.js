import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get all additional documents for a loan application
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
    
    // Get loanInfoId from query params
    const url = new URL(request.url);
    const loanInfoId = url.searchParams.get('loanInfoId');
    
    if (!loanInfoId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID is required' },
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
    
    // Get document record
    const documentRecord = await Document.findOne({ loanInfoId, userId });
    if (!documentRecord) {
      return NextResponse.json(
        { success: false, message: 'Document record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, additionalDocuments: documentRecord.additionalDocuments || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get additional documents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Add a new additional document request (admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // For admin endpoints, you might want to add admin verification
    // This is a placeholder - implement proper admin authentication
    const isAdmin = true; // Replace with actual admin verification
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { loanInfoId, additionalDocument } = data;
    
    if (!loanInfoId || !additionalDocument) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID and additional document details are required' },
        { status: 400 }
      );
    }
    
    // Find document record
    const documentRecord = await Document.findOne({ loanInfoId });
    if (!documentRecord) {
      return NextResponse.json(
        { success: false, message: 'Document record not found' },
        { status: 404 }
      );
    }
    
    // Add unique ID to the additional document
    const newAdditionalDocument = {
      ...additionalDocument,
      id: `additional-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestedAt: new Date(),
      status: 'requested',
      uploadedFiles: []
    };
    
    // Add to additionalDocuments array
    documentRecord.additionalDocuments = documentRecord.additionalDocuments || [];
    documentRecord.additionalDocuments.push(newAdditionalDocument);
    
    await documentRecord.save();
    
    return NextResponse.json(
      { success: true, additionalDocument: newAdditionalDocument },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add additional document error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}