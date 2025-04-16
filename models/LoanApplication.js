import mongoose from 'mongoose';

// Define nested schemas
const PropertyInfoSchema = new mongoose.Schema({
  propertyType: String,
  propertyValue: Number,
  propertyAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  propertyUsage: String,
  propertyAge: Number,
  bedrooms: Number,
  bathrooms: Number
}, { _id: false });

const CurrentMortgageSchema = new mongoose.Schema({
  lender: String,
  balance: Number,
  interestRate: Number,
  monthlyPayment: Number,
  remainingTerm: Number
}, { _id: false });

const EmploymentInfoSchema = new mongoose.Schema({
  employmentStatus: String,
  employerName: String,
  jobTitle: String,
  yearsInCurrentJob: Number,
  annualIncome: Number,
  additionalIncome: Number,
  isSelfEmployed: Boolean,
  businessType: String,
  abnAcn: String,
  businessIndustry: String,
  annualBusinessRevenue: Number
}, { _id: false });

const PartnerInfoSchema = new mongoose.Schema({
  hasPartner: Boolean,
  fullName: String,
  dateOfBirth: Date,
  employmentStatus: String,
  employerName: String,
  jobTitle: String,
  yearsInCurrentJob: Number,
  annualIncome: Number,
  isSelfEmployed: Boolean,
  businessType: String,
  abnAcn: String,
  businessIndustry: String,
  annualBusinessRevenue: Number
}, { _id: false });

const DebtSchema = new mongoose.Schema({
  type: String,
  lender: String,
  balance: Number,
  monthlyPayment: Number
}, { _id: false });

const FinancialInfoSchema = new mongoose.Schema({
  monthlyExpenses: Number,
  otherDebts: [DebtSchema],
  savingsBalance: Number,
  creditScore: Number,
  bankruptcyHistory: String
}, { _id: false });

const DesiredFeaturesSchema = new mongoose.Schema({
  offsetAccount: Boolean,
  redrawFacility: Boolean,
  extraRepayments: Boolean,
  fixedRate: Boolean,
  variableRate: Boolean,
  splitLoan: Boolean,
  interestOnly: Boolean,
  principalAndInterest: Boolean,
  packageDiscount: Boolean,
  noAnnualFee: Boolean
}, { _id: false });

const OfferSchema = new mongoose.Schema({
  amount: Number,
  interestRate: Number,
  comparisonRate: Number,
  term: Number,
  monthlyRepayment: Number,
  totalRepayment: Number,
  features: [String],
  cashback: Number,
  establishmentFee: Number,
  annualFee: Number,
  specialOffers: [String],
  expiryDate: Date
}, { _id: false });

const LenderInfoSchema = new mongoose.Schema({
  lender: String,
  applicationId: String,
  applicationDate: Date,
  offer: OfferSchema
}, { _id: false });

const NoteSchema = new mongoose.Schema({
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main schema
const LoanApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanType: String,
    loanAmount: Number,
    loanTerm: Number,
    loanPurpose: String,
    interestRateType: String,
    fixedRateTerm: Number,
    propertyInfo: PropertyInfoSchema,
    currentMortgage: CurrentMortgageSchema,
    employmentInfo: EmploymentInfoSchema,
    partnerInfo: PartnerInfoSchema,
    financialInfo: FinancialInfoSchema,
    status: {
      type: String,
      enum: ['draft', 'submitted', 'in_review', 'approved', 'rejected'],
      default: 'draft',
    },
    progress: {
      type: Number,
      default: 0
    },
    stage: {
      type: String,
      enum: ['property', 'personal', 'employment', 'financial', 'requirements', 'documents', 'review', 'complete'],
      default: 'property'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    documentsComplete: {
      type: Boolean,
      default: false
    },
    desiredFeatures: DesiredFeaturesSchema,
    lenderInfo: LenderInfoSchema,
    notes: [NoteSchema],
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    settlementDate: Date,
    expiryDate: Date
  },
  { timestamps: true }
);

export default mongoose.models.LoanApplication || mongoose.model('LoanApplication', LoanApplicationSchema);