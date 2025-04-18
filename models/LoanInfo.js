const mongoose = require('mongoose');

// Check if the model is already defined to prevent the "Cannot overwrite model" error
const LoanInfo = mongoose.models.LoanInfo || mongoose.model('LoanInfo', new mongoose.Schema({
  // Property Information
  propertyType: {
    type: String,
    default: ''
  },
  propertyValue: {
    type: Number,
    default: 500000
  },
  propertyAddress: {
    type: String,
    default: ''
  },
  propertyUsage: {
    type: String,
    default: ''
  },
  propertyAge: {
    type: Number,
    default: 0
  },
  bedrooms: {
    type: Number,
    default: 3
  },
  bathrooms: {
    type: Number,
    default: 2
  },
  currentMortgage: {
    type: Number,
    default: 400000
  },
  currentLender: {
    type: String,
    default: ''
  },
  currentInterestRate: {
    type: Number,
    default: 0
  },

  // Personal Information
  fullName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: String,
    default: ''
  },
  maritalStatus: {
    type: String,
    default: ''
  },
  dependents: {
    type: Number,
    default: 0
  },

  // Employment Information
  employmentStatus: {
    type: String,
    default: ''
  },
  employerName: {
    type: String,
    default: ''
  },
  jobTitle: {
    type: String,
    default: ''
  },
  yearsInCurrentJob: {
    type: Number,
    default: 0
  },
  annualIncome: {
    type: Number,
    default: 80000
  },
  additionalIncome: {
    type: Number,
    default: 0
  },
  isSelfEmployed: {
    type: Boolean,
    default: false
  },
  // Self-employed specific fields
  businessType: {
    type: String,
    default: ''
  },
  abnAcn: {
    type: String,
    default: ''
  },
  businessIndustry: {
    type: String,
    default: ''
  },
  annualBusinessRevenue: {
    type: Number,
    default: 0
  },
  // Partner details
  hasPartner: {
    type: Boolean,
    default: false
  },
  partnerEmploymentStatus: {
    type: String,
    default: ''
  },
  partnerEmployerName: {
    type: String,
    default: ''
  },
  partnerJobTitle: {
    type: String,
    default: ''
  },
  partnerYearsInCurrentJob: {
    type: Number,
    default: 0
  },
  partnerAnnualIncome: {
    type: Number,
    default: 0
  },
  partnerIsSelfEmployed: {
    type: Boolean,
    default: false
  },
  partnerBusinessType: {
    type: String,
    default: ''
  },
  partnerAbnAcn: {
    type: String,
    default: ''
  },
  partnerBusinessIndustry: {
    type: String,
    default: ''
  },
  partnerAnnualBusinessRevenue: {
    type: Number,
    default: 0
  },

  // Financial Information
  creditScore: {
    type: String,
    default: ''
  },
  monthlyExpenses: {
    type: Number,
    default: 0
  },
  existingDebts: {
    type: Number,
    default: 0
  },
  bankruptcyHistory: {
    type: String,
    default: ''
  },
  savingsBalance: {
    type: Number,
    default: 0
  },
  investments: {
    type: Number,
    default: 0
  },
  otherAssets: {
    type: Number,
    default: 0
  },

  // Loan Requirements
  loanAmount: {
    type: Number,
    default: 0
  },
  loanPurpose: {
    type: String,
    default: ''
  },
  loanTerm: {
    type: Number,
    default: 0
  },
  interestRatePreference: {
    type: String,
    default: ''
  },
  loanType: {
    type: String,
    default: ''
  },
  fixedRateTerm: {
    type: Number,
    default: 0
  },

  // Additional Features
  offsetAccount: {
    type: Boolean,
    default: false
  },
  redrawFacility: {
    type: Boolean,
    default: false
  },
  extraRepayments: {
    type: Boolean,
    default: false
  },
  interestOnly: {
    type: Boolean,
    default: false
  },
  fixedRate: {
    type: Boolean,
    default: false
  },
  splitLoan: {
    type: Boolean,
    default: false
  },
  packageDiscount: {
    type: Boolean,
    default: false
  },
  noFees: {
    type: Boolean,
    default: false
  },
  portability: {
    type: Boolean,
    default: false
  },
  parentGuarantee: {
    type: Boolean,
    default: false
  },

  // Status and user reference
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
}));

module.exports = LoanInfo;