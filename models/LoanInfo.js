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
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
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
    annualIncome: { type: Number, default: 80000 },
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
    monthlyExpenses: { type: Number, default: 2000 },
    existingDebts: { type: Number, default: 0 },
    bankruptcyHistory: { type: String, default: '' },
    savingsBalance: { type: Number, default: 20000 },
    investments: { type: Number, default: 0 },
    otherAssets: { type: Number, default: 0 }
  },
  property: {
    propertyType: { type: String, default: '' },
    propertyValue: { type: Number, default: 500000 },
    propertyAddress: { type: String, default: '' },
    propertyUsage: { type: String, default: '' },
    propertyAge: { type: Number, default: 0 },
    bedrooms: { type: Number, default: 3 },
    bathrooms: { type: Number, default: 2 },
    currentMortgage: { type: Number, default: 400000 },
    currentLender: { type: String, default: '' },
    currentInterestRate: { type: Number, default: 0 }
  },
  loanRequirements: {
    loanAmount: { type: Number, default: 400000 },
    loanPurpose: { type: String, default: '' },
    loanTerm: { type: Number, default: 30 },
    interestRatePreference: { type: String, default: '' },
    loanType: { type: String, default: '' },
    fixedRateTerm: { type: Number, default: 3 }
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
  }
}, {
  timestamps: true
}));

module.exports = LoanInfo;