import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import { verifyAdminToken } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    // Verify admin access
    const userId = await verifyAdminToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { id, docId } = params;
    const data = await request.json();
    const { status, signRequiredRequested } = data;
    
    if (!id || !docId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID and document ID are required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'uploaded', 'requested', 'completed', 'rejected', 'approved', 'review', 'verified'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create update object based on provided data
    const updateData = {};
    
    if (status) {
      updateData['documents.$[].uploadedFiles.$[file].status'] = status;
    }
    
    if (signRequiredRequested !== undefined) {
      updateData['documents.$[].uploadedFiles.$[file].signRequiredRequested'] = signRequiredRequested;
    }

    const result = await Document.findOneAndUpdate(
      { 
        loanInfoId: id,
        'documents.uploadedFiles._id': docId 
      },
      { $set: updateData },
      { 
        arrayFilters: [{ 'file._id': docId }],
        new: true,
        runValidators: true
      }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Document not found or update failed' },
        { status: 404 }
      );
    }
    
    // Check if all documents are verified (or approved/completed) and update overall status if needed
    if (status === 'verified' || status === 'approved' || status === 'completed') {
      const allVerified = result.documents.every(doc => 
        doc.uploadedFiles.every(file => ['verified', 'approved', 'completed'].includes(file.status))
      );
      if (allVerified) {
        await Document.findOneAndUpdate(
          { loanInfoId: id },
          { $set: { status: 'verified' } },
          { new: true }
        );
      }
    }
    
    // Find the updated document to return in response
    const updatedDoc = result.documents.find(doc => 
      doc.uploadedFiles.find(item => item?._id.toString() === docId)
    );
    
    return NextResponse.json(
      { 
        success: true, 
        document: updatedDoc,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}