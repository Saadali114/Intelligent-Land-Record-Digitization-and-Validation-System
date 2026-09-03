import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type VerificationAction = 'APPROVED' | 'REJECTED' | 'CORRECTED';

export interface IVerificationRecord extends MongooseDocument {
  recordId: mongoose.Types.ObjectId;
  verifiedBy: mongoose.Types.ObjectId;
  previousData: Record<string, any>;
  updatedData: Record<string, any>;
  action: VerificationAction;
  remarks: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRecordSchema = new Schema<IVerificationRecord>(
  {
    recordId: {
      type: Schema.Types.ObjectId,
      ref: 'LandRecord',
      required: true,
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    updatedData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    action: {
      type: String,
      enum: ['APPROVED', 'REJECTED', 'CORRECTED'],
      required: true,
      index: true,
    },
    remarks: {
      type: String,
      required: [true, 'Verification remarks are mandatory'],
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

VerificationRecordSchema.index({ recordId: 1, verifiedAt: -1 });

export const VerificationRecord = mongoose.model<IVerificationRecord>(
  'VerificationRecord',
  VerificationRecordSchema
);
