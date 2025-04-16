import mongoose from 'mongoose';

const LoanOfferSchema = new mongoose.Schema({
  loanApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lender: {
    type: String,
    required: true
  },
  lenderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['reviewing', 'approved', 'declined', 'more_info', 'accepted', 'expired'],
    default: 'reviewing'
  },
  applicationId: {
    type: String,
    required: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Loan amount cannot be negative']
  },
  interestRate: {
    type: Number,
    required: true,
    min: [0, 'Interest rate cannot be negative']
  },
  comparisonRate: {
    type: Number,
    required: true,
    min: [0, 'Comparison rate cannot be negative']
  },
  term: {
    type: Number,
    required: true,
    min: [1, 'Loan term must be at least 1 year']
  },
  monthlyRepayment: {
    type: Number,
    required: true
  },
  totalRepayment: {
    type: Number,
    required: true
  },
  features: [String],
  cashback: {
    type: Number,
    default: 0
  },
  establishmentFee: {
    type: Number,
    default: 0
  },
  annualFee: {
    type: Number,
    default: 0
  },
  specialOffers: [String],
  expiryDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  additionalDocuments: [{
    id: String,
    name: String,
    description: String,
    required: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['pending', 'uploaded', 'verified'],
      default: 'pending'
    }
  }],
  acceptedAt: Date,
  declinedAt: Date,
  settlementDate: Date,
  referenceNumber: String
}, {
  timestamps: true
});

export default mongoose.models.LoanOffer || mongoose.model('LoanOffer', LoanOfferSchema);