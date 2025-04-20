import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoanInfo from '@/models/LoanInfo';
import { verifyToken } from '@/lib/auth';

// Get pre-approved loans for a user
export async function GET(request) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get loanId from query params if provided
    const url = new URL(request.url);
    const loanId = url.searchParams.get('loanId');
    
    // Find the loan application
    const query = loanId ? { _id: loanId, userId } : { userId, status: 'approved' };
    const loanInfos = await LoanInfo.find(query);
    
    if (loanInfos.length === 0) {
      return NextResponse.json(
        { success: true, preApprovedLoans: [] },
        { status: 200 }
      );
    }
    
    // Generate pre-approved loan offers based on the loan application data
    const preApprovedLoans = loanInfos.flatMap(loanInfo => {
      // Calculate loan amount based on property value and LVR
      const propertyValue = loanInfo.property?.estimatedValue || 0;
      const requestedAmount = loanInfo.loanRequirements?.loanAmount || 0;
      
      // Generate different loan offers from various lenders
      const lenders = [
        {
          name: "Commonwealth Bank",
          baseRate: 5.49,
          cashbackOffer: 3000,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Free property reports",
          lenderRanking: 4.5,
          features: ["No early repayment fees", "Offset account", "Redraw facility"],
          logoUrl: "/placeholder.svg?height=60&width=120"
        },
        {
          name: "Westpac",
          baseRate: 5.65,
          cashbackOffer: 2500,
          processingTime: "Standard (5-7 days)",
          uniqueFeature: "Flexible repayment schedule",
          lenderRanking: 4.2,
          features: ["Fixed rate option", "Interest-only period available", "No annual fee"],
          logoUrl: "/placeholder.svg?height=60&width=120"
        },
        {
          name: "ANZ",
          baseRate: 5.35,
          cashbackOffer: 4000,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Free property valuation",
          lenderRanking: 4.7,
          features: ["No application fee", "Online account management", "Credit card included"],
          logoUrl: "/placeholder.svg?height=60&width=120"
        },
        {
          name: "NAB",
          baseRate: 5.42,
          cashbackOffer: 3500,
          processingTime: "Standard (5-7 days)",
          uniqueFeature: "Free financial health check",
          lenderRanking: 4.3,
          features: ["Split loan option", "Flexible terms", "Mobile app"],
          logoUrl: "/placeholder.svg?height=60&width=120"
        },
        {
          name: "ING",
          baseRate: 5.29,
          cashbackOffer: 2000,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Sustainability discount",
          lenderRanking: 4.6,
          features: ["No ongoing fees", "Extra repayments", "Redraw facility"],
          logoUrl: "/placeholder.svg?height=60&width=120"
        }
      ];
      
      // Generate loan offers from each lender with slight variations
      return lenders.map((lender, index) => {
        // Adjust loan amount slightly for each lender
        const amount = Math.round(requestedAmount * (0.95 + (index * 0.025)));
        
        // Adjust interest rate based on credit score and other factors
        const creditScore = loanInfo.financial?.creditScore || 700;
        const rateAdjustment = (creditScore - 700) / 10000; // Small adjustment based on credit score
        const interestRate = parseFloat((lender.baseRate - rateAdjustment).toFixed(2));
        
        // Calculate comparison rate (slightly higher than interest rate)
        const comparisonRate = parseFloat((interestRate + 0.15).toFixed(2));
        
        // Get loan term from application or default to 15 years
        const term = loanInfo.loanRequirements?.loanTerm || 15;
        
        // Calculate monthly repayment using loan formula
        const monthlyRate = interestRate / 100 / 12;
        const totalPayments = term * 12;
        const monthlyRepayment = parseFloat(
          (amount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
          (Math.pow(1 + monthlyRate, totalPayments) - 1)
        ).toFixed(2);
        
        // Calculate total repayment over the life of the loan
        const totalRepayment = parseFloat(monthlyRepayment * totalPayments).toFixed(2);
        
        // Calculate estimated savings compared to average market rate of 5.99%
        const marketRate = 5.99 / 100 / 12;
        const marketMonthlyPayment = 
          (amount * marketRate * Math.pow(1 + marketRate, totalPayments)) / 
          (Math.pow(1 + marketRate, totalPayments) - 1);
        const estimatedSavings = Math.round((marketMonthlyPayment - monthlyRepayment) * totalPayments);
        
        // Generate special offer based on lender
        const specialOffers = [
          "Rate match guarantee",
          "First year fee waiver",
          "Lowest rate guarantee",
          "Loyalty discount",
          "Orange Advantage package"
        ];
        
        return {
          id: `${loanInfo._id}-${lender.name.toLowerCase().replace(/\s/g, '-')}`,
          loanInfoId: loanInfo._id,
          lender: lender.name,
          amount: amount,
          interestRate: interestRate,
          comparisonRate: comparisonRate,
          term: term,
          monthlyRepayment: parseFloat(monthlyRepayment),
          totalRepayment: parseFloat(totalRepayment),
          features: lender.features,
          status: "conditionally-approved",
          expiryDays: 14 + (index * 7), // Different expiry periods
          logoUrl: lender.logoUrl,
          cashback: lender.cashbackOffer,
          estimatedSavings: estimatedSavings,
          specialOffer: specialOffers[index % specialOffers.length],
          lenderRanking: lender.lenderRanking,
          processingTime: lender.processingTime,
          uniqueFeature: lender.uniqueFeature
        };
      });
    });
    
    return NextResponse.json(
      { success: true, preApprovedLoans },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get pre-approved loans error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}