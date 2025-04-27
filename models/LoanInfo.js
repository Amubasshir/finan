const mongoose = require('mongoose');

// Check if the model is already defined to prevent the "Cannot overwrite model" error
const LoanInfo = mongoose.models.LoanInfo || mongoose.model('LoanInfo', new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'draft', 
      'submitted', 
      'pending_review', 
      'document_verification', 
      'lender_submission', 
      'lender_assessment', 
      'approved', 
      'rejected', 
      "pre_approved",
      'needs_attention'
    ],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },

  personal: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    dependents: { type: Number, default: 0 }
  },
  employment: {
    employmentStatus: { type: String, default: '' },
    employerName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    yearsInCurrentJob: { type: Number, default: 0 },
    annualIncome: { type: Number, default: 0 },
    additionalIncome: { type: Number, default: 0 },
    isSelfEmployed: { type: Boolean, default: false },
    businessType: { type: String, default: '' },
    abnAcn: { type: String, default: '' },
    businessIndustry: { type: String, default: '' },
    annualBusinessRevenue: { type: Number, default: 0 },
    hasPartner: { type: Boolean, default: false },
    partnerEmploymentStatus: { type: String, default: '' },
    partnerEmployerName: { type: String, default: '' },
    partnerJobTitle: { type: String, default: '' },
    partnerYearsInCurrentJob: { type: Number, default: 0 },
    partnerAnnualIncome: { type: Number, default: 0 },
    partnerIsSelfEmployed: { type: Boolean, default: false },
    partnerBusinessType: { type: String, default: '' },
    partnerAbnAcn: { type: String, default: '' },
    partnerBusinessIndustry: { type: String, default: '' },
    partnerAnnualBusinessRevenue: { type: Number, default: 0 }
  },
  financial: {
    creditScore: { type: String, default: '' },
    monthlyExpenses: { type: Number, default: 0 },
    existingDebts: { type: Number, default: 0 },
    bankruptcyHistory: { type: String, default: '' },
    savingsBalance: { type: Number, default: 0 },
    investments: { type: Number, default: 0 },
    otherAssets: { type: Number, default: 0 },
    currentMortgage: { type: Number, default: 0 },
    currentLender: { type: String, default: '' },
    currentInterestRate: { type: Number, default: 0 },
    currentLoanTerm: { type: Number, default: 0 },
    remainingLoanTerm: { type: Number, default: 0 },
    fixedRateExpiry: { type: String, default: '' },
    exitFees: { type: Number, default: 0 }
  },
  property: {
    propertyType: { type: String, default: '' },
    propertyValue: { type: Number, default: 0 },
    propertyAddress: { type: String, default: '' },
    propertyUsage: { type: String, default: '' },
    propertyAge: { type: Number, default: 0 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    currentMortgage: { type: Number, default: 0 },
    currentLender: { type: String, default: '' },
    currentInterestRate: { type: Number, default: 0 }
  },
  loanRequirements: {
    loanAmount: { type: Number, default: 0 },
    loanPurpose: { type: String, default: '' },
    loanTerm: { type: Number, default: 0 },
    interestRatePreference: { type: String, default: '' },
    loanType: { type: String, default: '' },
    fixedRateTerm: { type: Number, default: 0 }
  },
  additionalFeatures: {
    offsetAccount: { type: Boolean, default: false },
    redrawFacility: { type: Boolean, default: false },
    extraRepayments: { type: Boolean, default: false },
    interestOnly: { type: Boolean, default: false },
    fixedRate: { type: Boolean, default: false },
    splitLoan: { type: Boolean, default: false },
    packageDiscount: { type: Boolean, default: false },
    noFees: { type: Boolean, default: false },
    portability: { type: Boolean, default: false },
    parentGuarantee: { type: Boolean, default: false }
  },
  timeline:[{
    status: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    changedBy: { type: String, default: 'Admin',lowecase:true },
  }],
  dateSubmitted: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
}));

module.exports = LoanInfo;