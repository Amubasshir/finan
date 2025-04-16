import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  loanApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication',
    required: true,
    index: true
  },
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  attachments: [{
    name: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);