const mongoose = require('mongoose');

const DocumentFileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: String, required: true },
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true }
});

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  downloadLink: { type: String },
  required: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: ["identity", "income", "property", "financial", "other", "business", "partner"],
    required: true 
  },
  multipleAllowed: { type: Boolean, default: false },
  uploadedFiles: [DocumentFileSchema],
  applicableFor: { 
    type: String, 
    enum: ["primary", "partner", "business", "all"],
    required: true 
  }
});

const DocumentsSchema = new mongoose.Schema({
  loanInfoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanInfo',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'complete', 'rejected', 'approved', 'review'],
    default: 'pending'
  },
  documents: [DocumentSchema]
}, {
  timestamps: true
});

// Check if the model is already defined to prevent the "Cannot overwrite model" error
const Document = mongoose.models.Document || mongoose.model('Document', DocumentsSchema);

module.exports = Document;