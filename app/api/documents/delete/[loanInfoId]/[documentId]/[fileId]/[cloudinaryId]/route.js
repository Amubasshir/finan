import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

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
    
    // Get parameters from URL
    const { loanInfoId, documentId, fileId, cloudinaryId } = params;
    
    if (!loanInfoId || !documentId || !fileId || !cloudinaryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Verify loan info ownership
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(decodeURIComponent(cloudinaryId));
    
    // Also remove the file reference from the database
    const documentRecord = await Document.findOne({ loanInfoId, userId });
    
    if (documentRecord) {
      // Find the document in the documents array that contains the file to delete
      const updatedDocuments = documentRecord.documents.map(doc => {
        if (doc.id === documentId) {
          // Remove the file from uploadedFiles array
          return {
            ...doc,
            uploadedFiles: doc.uploadedFiles.filter(file => file.id !== fileId)
          };
        }
        return doc;
      });
      
      // Update the document record with the modified documents array
      await Document.findOneAndUpdate(
        { loanInfoId, userId },
        { $set: { documents: updatedDocuments } },
        { new: true }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully from Cloudinary and database'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}