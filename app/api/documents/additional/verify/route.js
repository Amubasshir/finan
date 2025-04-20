import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import { verifyToken } from '@/lib/auth';

export async function PUT(request) {
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
    const { loanInfoId, additionalDocumentId, verified = true } = data;
    
    if (!loanInfoId || !additionalDocumentId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID and additional document ID are required' },
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
    
    // Find the additional document
    const additionalDocIndex = documentRecord.additionalDocuments.findIndex(
      doc => doc.id === additionalDocumentId
    );
    
    if (additionalDocIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Additional document not found' },
        { status: 404 }
      );
    }
    
    // Update status
    documentRecord.additionalDocuments[additionalDocIndex].status = verified ? 'verified' : 'pending';
    
    await documentRecord.save();
    
    return NextResponse.json(
      { 
        success: true, 
        additionalDocument: documentRecord.additionalDocuments[additionalDocIndex]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify additional document error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}