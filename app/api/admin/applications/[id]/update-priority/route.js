import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo'; // This should match the actual filename case
import { verifyAdminToken } from '@/lib/auth';

export async function POST(
    req,
    { params }
) {
    try {
        await connectDB();

        const userId = await verifyAdminToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const data = await req.json();

        if (!data || typeof data !== 'object' || !data.priority) {
            return NextResponse.json({ success: false, message: 'Invalid data or missing priority' }, { status: 400 });
        }

        // Validate priority value
        const validPriorities = ['high', 'medium', 'low'];
        if (!validPriorities.includes(data.priority)) {
            return NextResponse.json({ success: false, message: 'Invalid priority value' }, { status: 400 });
        }

        const updatedApplication = await LoanInfo.findOneAndUpdate(
            { _id: id },
            { $set: { priority: data.priority } },
            { new: true }
        );

        if (!updatedApplication) {
            return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, application: updatedApplication });

    } catch (error) {
        console.error('Error updating priority:', error);
        return NextResponse.json({ success: false, message: 'Failed to update priority' }, { status: 500 });
    }
}