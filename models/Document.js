import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    loanApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanApplication',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: [
        'identityDocument',
        'proofOfIncome',
        'bankStatement',
        'taxReturn',
        'propertyValuation',
        'insuranceDocument',
        'other'
      ],
      default: 'other',
    },
    description: String,
    fileUrl: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);