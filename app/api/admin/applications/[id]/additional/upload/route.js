import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

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
    
    const formData = await request.formData();
    const file = formData.get('file');
    const loanInfoId = formData.get('loanInfoId');
    const additionalDocumentId = formData.get('additionalDocumentId');
    
    if (!file || !loanInfoId || !additionalDocumentId) {
      return NextResponse.json(
        { success: false, message: 'File, loan info ID, and additional document ID are required' },
        { status: 400 }
      );
    }
    
    // Verify loan info exists and belongs to user
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found or does not belong to user' },
        { status: 404 }
      );
    }
    
    // Find document record
    const documentRecord = await Document.findOne({ loanInfoId, userId });
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
    
    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `loan-documents/${loanInfoId}/additional`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.write(buffer);
      uploadStream.end();
    });
    
    // Create file record
    const fileRecord = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: result.secure_url,
      cloudinaryId: result.public_id,
    };
    
    // Add file to additional document
    documentRecord.additionalDocuments[additionalDocIndex].uploadedFiles.push(fileRecord);
    documentRecord.additionalDocuments[additionalDocIndex].status = 'uploaded';
    
    await documentRecord.save();
    
    return NextResponse.json(
      { 
        success: true, 
        fileId: fileRecord.id,
        url: fileRecord.url,
        cloudinaryId: fileRecord.cloudinaryId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload additional document file error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}