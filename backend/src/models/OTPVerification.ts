import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type OTPPurpose = 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION' | 'MOBILE_VERIFICATION';
export type OTPStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'LOCKED';

export interface IOTPVerification extends MongooseDocument {
  email?: string;
  mobile?: string;
  otpHash?: string;
  providerReqId?: string;
  purpose: OTPPurpose;
  status: OTPStatus;
  attempts: number;
  expiresAt: Date;
  lastSentAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      index: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      index: true,
      trim: true,
    },
    otpHash: {
      type: String,
    },
    providerReqId: {
      type: String,
    },
    purpose: {
      type: String,
      enum: ['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'MOBILE_VERIFICATION'],
      default: 'EMAIL_VERIFICATION',
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'EXPIRED', 'LOCKED'],
      default: 'PENDING',
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index automatically cleans up expired records
    },
    lastSentAt: {
      type: Date,
      required: true,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast queries on active verification sessions
OTPVerificationSchema.index({ email: 1, purpose: 1, status: 1, createdAt: -1 });
OTPVerificationSchema.index({ mobile: 1, purpose: 1, status: 1, createdAt: -1 });


export const OTPVerification = mongoose.model<IOTPVerification>(
  'OTPVerification',
  OTPVerificationSchema
);
