import mongoose from 'mongoose';

const LenderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lender name is required'],
    unique: true,
    trim: true
  },
  logoUrl: {
    type: String
  },
  color: {
    type: String,
    default: '#000000'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    loanType: {
      type: String,
      enum: ['home', 'refinance', 'investment', 'business', 'personal']
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
    maxLoanAmount: {
      type: Number,
      required: true,
      min: [0, 'Maximum loan amount cannot be negative']
    },
    minLoanAmount: {
      type: Number,
      default: 0
    },
    maxLoanTerm: {
      type: Number,
      default: 30
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
    specialOffers: [{
      description: String,
      expiryDate: Date
    }]
  }],
  requiredDocuments: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['identity', 'income', 'employment', 'property', 'financial', 'business', 'other']
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Lender || mongoose.model('Lender', LenderSchema);