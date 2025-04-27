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
    
    if (!id || !docId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID and document ID are required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'uploaded', 'requested', 'completed', 'rejected', 'approved', 'review', 'verified'];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create update object based on provided data
    const updateData = {};
    
    if (data.status) {
      updateData['additionalDocuments.$[].uploadedFiles.$[file].status'] = data.status;
    }
    
    if (data.signRequiredRequested !== undefined && data.signRequiredRequested !== "") {
      updateData['additionalDocuments.$[].uploadedFiles.$[file].signRequiredRequested'] = data.signRequiredRequested;
    }
    
    // Use findOneAndUpdate to find and update in a single operation
    const result = await Document.findOneAndUpdate(
      { 
        loanInfoId: id,
        'additionalDocuments.uploadedFiles._id': docId 
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
    
    // Find the updated additional document to return in response
    const updatedDoc = result.additionalDocuments.find(doc => 
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
    console.error('Update additional document error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}