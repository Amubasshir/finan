import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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
    const documentId = formData.get('documentId');
    const category = formData.get('category') || 'other'; // Get category from formData with default fallback
    
    if (!file || !loanInfoId || !documentId) {
      return NextResponse.json(
        { success: false, message: 'File, loan info ID, and document ID are required' },
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
    
    // Find or create document record
    let documentRecord = await Document.findOne({ loanInfoId, userId });
    
    // If document record doesn't exist, create a default one
    if (!documentRecord) {
      documentRecord = await Document.create({
        loanInfoId,
        userId,
        documents: [{
          id: documentId,
          name: "Document Upload",
          description: "Uploaded document",
          required: true,
          multipleAllowed: true,
          uploadedFiles: [],
          category: category, // Use the category from formData
          applicableFor: "primary"
        }],
        status: 'pending'
      });
    }
    
    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `loan-documents/${userId}/${loanInfoId}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });
    
    // Create file record
    const fileRecord = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id
    };
    
    // Find the target document in the documents array
    const targetDocumentIndex = documentRecord.documents.findIndex(doc => doc.id === documentId);
    
    if (targetDocumentIndex === -1) {
      // If the document doesn't exist in the array, add it
      documentRecord.documents.push({
        id: documentId,
        name: "Document Upload",
        description: "Uploaded document",
        required: true,
        multipleAllowed: true,
        category: category, // Use the category from formData
        applicableFor: "primary",
        uploadedFiles: [fileRecord]
      });
    } else {
      // If multiple files not allowed, replace existing files
      if (!documentRecord.documents[targetDocumentIndex].multipleAllowed) {
        documentRecord.documents[targetDocumentIndex].uploadedFiles = [fileRecord];
      } else {
        documentRecord.documents[targetDocumentIndex].uploadedFiles.push(fileRecord);
      }
    }
    
    await documentRecord.save();
    
    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: 'File uploaded successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}