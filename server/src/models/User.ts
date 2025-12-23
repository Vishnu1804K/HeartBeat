import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  height: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  medicalConditions: [{
    type: String
  }],
  fitnessGoals: [{
    goal: { type: String, required: true },
    progress: { type: Number, default: 0 },
    target: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now }
  }],
  vitalSigns: [{
    type: { type: String, required: true },
    value: { type: String, required: true },
    recordedAt: { type: Date, default: Date.now }
  }],
  activities: [{
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    distance: { type: Number, default: null },
    caloriesBurned: { type: Number, default: 0 },
    intensity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    recordedAt: { type: Date, default: Date.now }
  }],
  healthcareProviders: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['doctor', 'hospital', 'insurance', 'clinic', 'specialist'], required: true },
    specialty: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  appointments: [{
    providerId: { type: Schema.Types.ObjectId },
    providerName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  savedResources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);


