import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Check authentication
    const userId = await verifyAdminToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status');
    const tab = url.searchParams.get('tab') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'dateSubmitted';
    const sortDirection = url.searchParams.get('sortDirection') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // Build the query for Mongoose
    const query: any = {};
    
    // Apply search filter
    if (searchTerm) {
      query.$or = [
        { applicantName: { $regex: searchTerm, $options: 'i' } },
        { id: { $regex: searchTerm, $options: 'i' } },
        { lender: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Apply tab filter
    if (tab === 'pending') {
      query.status = { $in: ['pending_review', 'document_verification'] };
    } else if (tab === 'processing') {
      query.status = { $in: ['lender_submission', 'lender_assessment'] };
    } else if (tab === 'attention') {
      query.status = 'needs_attention';
    } else if (tab === 'completed') {
      query.status = { $in: ['approved', 'rejected'] };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Create sort object for Mongoose
    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    
    // Get applications with pagination using Mongoose
    const applications = await LoanInfo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await LoanInfo.countDocuments(query);
    
    // Get counts for dashboard stats
    const totalApplications = await LoanInfo.countDocuments();
    const needsAttentionCount = await LoanInfo.countDocuments({ status: 'needs_attention' });
    const approvedCount = await LoanInfo.countDocuments({ status: 'approved' });
    const pendingReviewCount = await LoanInfo.countDocuments({ status: 'pending_review' });
    
    // Get counts for tabs
    const pendingCount = await LoanInfo.countDocuments({ 
      status: { $in: ['pending_review', 'document_verification'] } 
    });
    const processingCount = await LoanInfo.countDocuments({ 
      status: { $in: ['lender_submission', 'lender_assessment'] } 
    });
    const completedCount = await LoanInfo.countDocuments({ 
      status: { $in: ['approved', 'rejected'] } 
    });
    
    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats: {
        total: totalApplications,
        needsAttention: needsAttentionCount,
        approved: approvedCount,
        pendingReview: pendingReviewCount
      },
      tabCounts: {
        all: totalApplications,
        pending: pendingCount,
        processing: processingCount,
        attention: needsAttentionCount,
        completed: completedCount
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Check authentication
    const userId = await verifyAdminToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate the data
    if (!data) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }
    
    // Create the application using Mongoose
    const newApplication = new LoanInfo({
      ...data,
      dateSubmitted: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    
    await newApplication.save();
    
    return NextResponse.json({ success: true, application: newApplication });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ success: false, message: 'Failed to create application' }, { status: 500 });
  }
}