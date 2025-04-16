import mongoose from 'mongoose';

const LenderOfferSchema = new mongoose.Schema(
  {
    loanApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanApplication',
      required: true,
    },
    lender: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    comparisonRate: {
      type: Number,
      required: true,
    },
    term: {
      type: Number,
      required: true,
    },
    monthlyRepayment: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    features: [String],
    cashback: Number,
    establishmentFee: {
      type: Number,
      default: 0,
    },
    annualFee: {
      type: Number,
      default: 0,
    },
    specialOffers: [String],
    expiryDate: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acceptedAt: Date,
    declinedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.LenderOffer || mongoose.model('LenderOffer', LenderOfferSchema);