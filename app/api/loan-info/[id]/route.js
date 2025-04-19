// Fix the import statement for LoanInfo model
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo'; // This should match the actual filename case
import { verifyToken } from '@/lib/auth';

// Get a specific loan info
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
    
    // Safely extract id from params
    const id = params?.id;
    
    const loanInfo = await LoanInfo.findOne({ _id: id, userId });
    
    if (!loanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, loanInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

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
    
    const { id } = params || {};
    const updateData = await request.json();
    
    // Process all sections with proper type conversion
    const processedData = {};
    
    // Process each section if it exists in the update data
    const sections = ['personal', 'employment', 'financial', 'property', 'loanRequirements', 'additionalFeatures'];
    
    sections.forEach(section => {
      if (updateData[section]) {
        processedData[section] = { ...updateData[section] };
        
        // Convert numeric fields in financial section
        if (section === 'financial') {
          const numericFields = ['monthlyExpenses', 'existingDebts', 'savingsBalance', 
                                'investments', 'otherAssets', 'currentMortgage', 
                                'currentInterestRate', 'currentLoanTerm', 
                                'remainingLoanTerm', 'exitFees'];
          
          numericFields.forEach(field => {
            if (processedData[section][field] !== undefined) {
              processedData[section][field] = Number(processedData[section][field]);
            }
          });
        }
        
        // Convert numeric fields in property section
        if (section === 'property') {
          const numericFields = ['propertyValue', 'propertyAge', 'bedrooms', 
                                'bathrooms', 'currentMortgage', 'currentInterestRate'];
          
          numericFields.forEach(field => {
            if (processedData[section][field] !== undefined) {
              processedData[section][field] = Number(processedData[section][field]);
            }
          });
        }
        
        // Convert numeric fields in employment section
        if (section === 'employment') {
          const numericFields = ['yearsInCurrentJob', 'annualIncome', 'additionalIncome', 
                                'annualBusinessRevenue', 'partnerYearsInCurrentJob', 
                                'partnerAnnualIncome', 'partnerAnnualBusinessRevenue'];
          
          numericFields.forEach(field => {
            if (processedData[section][field] !== undefined) {
              processedData[section][field] = Number(processedData[section][field]);
            }
          });
        }
        
        // Convert numeric fields in loanRequirements section
        if (section === 'loanRequirements') {
          const numericFields = ['loanAmount', 'loanTerm', 'fixedRateTerm'];
          
          numericFields.forEach(field => {
            if (processedData[section][field] !== undefined) {
              processedData[section][field] = Number(processedData[section][field]);
            }
          });
        }
        
        // Convert numeric fields in personal section
        if (section === 'personal') {
          if (processedData[section].dependents !== undefined) {
            processedData[section].dependents = Number(processedData[section].dependents);
          }
        }
      }
    });
    
    // Handle any top-level fields
    Object.keys(updateData).forEach(key => {
      if (!sections.includes(key)) {
        processedData[key] = updateData[key];
      }
    });

    // First check if the document exists
    const existingDoc = await LoanInfo.findOne({ _id: id, userId });
    if (!existingDoc) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }

    console.log('Processed Data:', processedData);
    // Update the document
    const updatedLoanInfo = await LoanInfo.findOneAndUpdate(
      { _id: id, userId },
      { $set: processedData },
      { new: true }
    );
    
    // Convert to plain object to ensure all fields are included
    const plainObject = updatedLoanInfo.toObject();
    
    return NextResponse.json(
      { success: true, loanInfo: plainObject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

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
    
    // Safely extract id from params
    const id = params?.id;
    
    const deletedLoanInfo = await LoanInfo.findOneAndDelete({ _id: id, userId });
    
    if (!deletedLoanInfo) {
      return NextResponse.json(
        { success: false, message: 'Loan info not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Loan info deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete loan info error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}