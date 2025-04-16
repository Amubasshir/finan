import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
    match: [/^(\+\d{1,3}[- ]?)?\d{10,15}$/, 'Please provide a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password should be at least 8 characters long'],
    select: false, // Don't return password by default
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Australia'
    }
  },
  residentialStatus: {
    type: String,
    enum: ['owner', 'renter', 'living_with_parents', 'other']
  },
  timeAtAddress: {
    years: Number,
    months: Number
  },
  previousAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  receiveUpdates: {
    type: Boolean,
    default: false,
  },
  agreedToTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms and conditions'],
    default: false,
  },
  termsAgreedAt: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user',
  },
  lastLogin: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);