import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_STATUS_CHANGED'
  | 'USER_DELETED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_DELETED'
  | 'RECORD_CREATED'
  | 'RECORD_UPDATED'
  | 'RECORD_VERIFIED'
  | 'RECORD_REJECTED'
  | 'RECORD_CORRECTED'
  | 'RECORD_DELETED'
  | 'AI_EXTRACTION_COMPLETED'
  | 'AI_EXTRACTION_FAILED'
  | 'OTP_REQUESTED'
  | 'OTP_SENT'
  | 'OTP_VERIFICATION_SUCCESS'
  | 'OTP_VERIFICATION_FAILED'
  | 'OTP_RATE_LIMITED'
  | 'OTP_PROVIDER_ERROR'
  | 'MOBILE_VERIFIED'
  | 'EMAIL_OTP_REQUESTED'
  | 'EMAIL_OTP_SENT'
  | 'EMAIL_OTP_VERIFICATION_SUCCESS'
  | 'EMAIL_OTP_VERIFICATION_FAILED'
  | 'EMAIL_OTP_EXPIRED'
  | 'EMAIL_OTP_RATE_LIMITED'
  | 'EMAIL_PROVIDER_ERROR'
  | 'EMAIL_VERIFIED';

export interface IAuditLog extends MongooseDocument {
  userId?: mongoose.Types.ObjectId;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
