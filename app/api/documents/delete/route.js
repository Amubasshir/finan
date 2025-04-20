import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request) {
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
    const { loanInfoId, documentId, fileId, cloudinaryId } = data;
    
    if (!loanInfoId || !documentId || !fileId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID, document ID, and file ID are required' },
        { status: 400 }
      );
    }
    
    // Find the document record
    const documentRecord = await Document.findOne({ loanInfoId, userId });
    if (!documentRecord) {
      return NextResponse.json(
        { success: false, message: 'Document record not found' },
        { status: 404 }
      );
    }
    
    // Find the specific document
    const targetDocument = documentRecord.documents.id(documentId);
    if (!targetDocument) {
      return NextResponse.json(
        { success: false, message: 'Document not found in collection' },
        { status: 404 }
      );
    }
    
    // Find the file to remove
    const fileIndex = targetDocument.uploadedFiles.findIndex(file => file.id === fileId);
    if (fileIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }
    
    // Delete from Cloudinary if cloudinaryId is provided
    if (cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(cloudinaryId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }
    
    // Remove file from document
    targetDocument.uploadedFiles.splice(fileIndex, 1);
    await documentRecord.save();
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('File delete error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}