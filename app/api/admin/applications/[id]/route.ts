import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo'; // This should match the actual filename case
import { verifyAdminToken } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check authentication
    const userId = await verifyAdminToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Find application using Mongoose
    const application = await LoanInfo.findById(id);
    
    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check authentication
    const userId = await verifyAdminToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    const data = await req.json();
    
    // Validate the data
    if (!data) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }
    
    // Update the application using proper Mongoose syntax
    const updatedApplication = await LoanInfo.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true } // Return the updated document
    );
    
    if (!updatedApplication) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ success: false, message: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check authentication
    const userId = await verifyAdminToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Delete the application using proper Mongoose syntax
    const deletedApplication = await LoanInfo.findByIdAndDelete(id);
    
    if (!deletedApplication) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete application' }, { status: 500 });
  }
}