import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get documents for a specific loan application
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const loanInfoId = params?.id;
    if (!loanInfoId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID is required' },
        { status: 400 }
      );
    }
    
    // Get the loan info to verify ownership and get loan details
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Get documents for this loan application
    let documents = await Document.findOne({ loanInfoId }).lean();
    
    // If no documents exist yet, initialize with default document structure
    if (!documents) {
      // Create default document structure based on loan info
      const defaultDocuments = createDefaultDocuments(loanInfo);
      
      // Create new document record
      documents = await Document.create({
        loanInfoId,
        userId,
        documents: defaultDocuments,
        status: 'pending'
      });
      
      return NextResponse.json({
        success: true,
        documents: documents
      });
    }
    
    return NextResponse.json({
      success: true,
      documents: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch documents', error: error.message },
      { status: 500 }
    );
  }
}

// Update documents for a specific loan application
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const loanInfoId = params?.id;
    if (!loanInfoId) {
      return NextResponse.json(
        { success: false, message: 'Loan info ID is required' },
        { status: 400 }
      );
    }
    
    const { documents } = await request.json();
    
    // Verify the loan info exists and belongs to the user
    const loanInfo = await LoanInfo.findOne({ _id: loanInfoId, userId });
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    // Update or create document collection
    const updatedDocuments = await Document.findOneAndUpdate(
      { loanInfoId, userId },
      { $set: { documents } },
      { new: true, upsert: true }
    );
    console.log('Updated documents:', updatedDocuments);
    return NextResponse.json(
      { success: true, documents: updatedDocuments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update documents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Helper function to create default document structure based on loan info
function createDefaultDocuments(loanInfo) {
  const hasPartner = loanInfo?.employment?.hasPartner || false;
  const isBusinessOwner = loanInfo?.employment?.isSelfEmployed || false;
  
  // Define all documents with array structure instead of object
  const initialDocuments = [
    {
      id: "doc1",
      name: "Photo ID (Driver's License or Passport)",
      description: "Clear copy of your current photo ID",
      required: true,
      category: "identity",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc2",
      name: "Proof of Address",
      description: "Utility bill or bank statement from the last 3 months",
      required: true,
      category: "identity",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc3",
      name: "Pay Slips",
      description: "Last 3 months of pay slips showing regular income",
      required: true,
      category: "income",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc4",
      name: "Bank Statements",
      description: "Last 3 months of bank statements showing income deposits",
      required: true,
      category: "income",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc5",
      name: "Tax Returns",
      description: "Most recent tax return including all schedules",
      required: true,
      category: "financial",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc6",
      name: "W-2 Forms",
      description: "Most recent W-2 forms from all employers",
      required: true,
      category: "financial",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc7",
      name: "Property Information",
      description: "Current property details, title, or purchase agreement",
      required: true,
      category: "property",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc8",
      name: "Property Insurance",
      description: "Current property insurance documentation",
      required: false,
      category: "property",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    {
      id: "doc9",
      name: "Additional Assets",
      description: "Documentation of other assets (investments, properties, etc.)",
      required: false,
      category: "financial",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "primary",
    },
    // Partner documents
    {
      id: "doc10",
      name: "Partner's Photo ID",
      description: "Clear copy of your partner's current photo ID",
      required: hasPartner,
      category: "partner", 
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "partner",
      conditionalDisplay: {
        field: "hasPartner",
        value: true,
      },
    },
    {
      id: "doc11",
      name: "Partner's Proof of Address",
      description: "Recent utility bill or bank statement showing partner's address",
      required: hasPartner,
      category: "partner",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "partner",
      conditionalDisplay: {
        field: "hasPartner",
        value: true,
      },
    },
    {
      id: "doc12", 
      name: "Partner's Income Documents",
      description: "Last 3 months of pay slips or income statements",
      required: hasPartner,
      category: "partner",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "partner",
      conditionalDisplay: {
        field: "hasPartner",
        value: true,
      },
    },
    // Business documents
    {
      id: "doc13",
      name: "Business Registration",
      description: "Official business registration or incorporation documents",
      required: isBusinessOwner,
      category: "business",
      multipleAllowed: false,
      uploadedFiles: [],
      applicableFor: "business",
      conditionalDisplay: {
        field: "isBusinessOwner",
        value: true,
      },
    },
    {
      id: "doc14",
      name: "Business Financial Statements",
      description: "Last 2 years of business financial statements",
      required: isBusinessOwner,
      category: "business",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "business",
      conditionalDisplay: {
        field: "isBusinessOwner",
        value: true,
      },
    },
    {
      id: "doc15",
      name: "Business Tax Returns",
      description: "Last 2 years of business tax returns",
      required: isBusinessOwner,
      category: "business",
      multipleAllowed: true,
      uploadedFiles: [],
      applicableFor: "business",
      conditionalDisplay: {
        field: "isBusinessOwner",
        value: true,
      },
    }
  ];

  // Filter out documents that shouldn't be shown based on conditions
  return initialDocuments.filter(doc => {
    if (!doc.conditionalDisplay) return true;
    if (doc.conditionalDisplay.field === "hasPartner") return hasPartner === doc.conditionalDisplay.value;
    if (doc.conditionalDisplay.field === "isBusinessOwner") return isBusinessOwner === doc.conditionalDisplay.value;
    return true;
  });
}