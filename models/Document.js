const mongoose = require('mongoose');

const DocumentFileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: String, required: true },
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  signRequiredRequested: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending',"pre_approved", 'uploaded', 'requested', 'completed', 'rejected', 'approved', 'review', 'verified'],
    default: 'uploaded'
  },
},{timestamps: true});
const AdditionalDocumentFileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: String, required: true },
  url: { type: String, default:""},
  cloudinaryId: { type: String,default:"" },
  signRequiredRequested: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending',"pre_approved", 'uploaded', 'requested', 'completed', 'rejected', 'approved', 'review', 'verified'],
    default: 'requested'
  },
},{timestamps: true});

// New schema for additional documents requested by admin
const AdditionalDocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  requestedBy: { type: String, required: true,lowercase:true },
  requestedAt: { type: Date, default: Date.now },
  signRequiredRequested: { type: Boolean, default: true },
  uploadedFiles: [AdditionalDocumentFileSchema]
},{timestamps: true});

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  downloadLink: { type: String },
  required: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: ["identity","pre_approved","requested", "income", "property", "financial", "other", "business", "partner"],
    required: true 
  },
  multipleAllowed: { type: Boolean, default: false },
  signRequiredRequested: { type: Boolean, default: false },
  uploadedFiles: [DocumentFileSchema],
  applicableFor: { 
    type: String, 
    enum: ["primary", "partner", "business", "all"],
    required: true 
  }
},{timestamps: true});

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

  documents: [DocumentSchema],
  // Add additional documents array to the main schema
  additionalDocuments: [AdditionalDocumentSchema]
}, {
  timestamps: true
});

// Check if the model is already defined to prevent the "Cannot overwrite model" error
const Document = mongoose.models.Document || mongoose.model('Document', DocumentsSchema);

module.exports = Document;