import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyAdminToken } from '@/lib/auth';
import { nanoid } from 'nanoid';

// Get all additional documents for a loan application
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyAdminToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { id: loanInfoId } = params;    
    if (!loanInfoId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID is required' },
        { status: 400 }
      );
    }
    
    // Verify loan info exists
    const loanInfo = await LoanInfo.findById(loanInfoId);
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Get document record
    const documentRecord = await Document.findOne({ loanInfoId }).lean();
    if (!documentRecord) {
      return NextResponse.json(
        { success: false, message: 'Document record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        additionalDocuments: documentRecord.additionalDocuments || [], 
        documents: documentRecord.documents || [], 
        status: documentRecord.status 
      },
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
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyAdminToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { id: loanInfoId } = params;
    const data = await request.json();
    
    if (!loanInfoId || !data?.name || !data?.description || !data?.deadline || !data?.requestedBy) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID, name, description, deadline, and requestedBy are required' },
        { status: 400 }
      );
    }
    
    // Verify loan info exists
    const loanInfo = await LoanInfo.findById(loanInfoId);
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Prepare new additional document
    const newAdditionalDocument = {
      id: nanoid(),
      name: data.name,
      description: data.description,
      deadline: data.deadline,
      requestedBy: data.requestedBy.toLowerCase(),
      requestedAt: new Date(),
      signRequiredRequested: data.signRequiredRequested ?? true,
      uploadedFiles: [{
        id: `additional-${nanoid()}`,
        name: data.name,
        size: 0,
        uploadDate: new Date().toISOString(),
        url: '',
        cloudinaryId: '',
        signRequiredRequested: true,
        status: 'requested'
      }]
    };
    
    // Use findOneAndUpdate to atomically update the document record
    const documentRecord = await Document.findOneAndUpdate(
      { loanInfoId },
      {
        $push: {
          additionalDocuments: newAdditionalDocument
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: true // Create a new document record if none exists
      }
    );
    
    if (!documentRecord) {
      return NextResponse.json(
        { success: false, message: 'Failed to create or update document record' },
        { status: 500 }
      );
    }
    
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