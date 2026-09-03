import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface ILandRecord extends MongooseDocument {
  ownerName: string;
  surveyNumber: string;
  khasraNumber: string;
  khataNumber: string;
  plotArea: string; // e.g. "2.5 Acres" or "1.01 Hectares"
  village: string;
  tehsil: string;
  district: string;
  landClassification: string; // e.g. "Agricultural", "Non-Agricultural", "Residential", "Commercial", "Forest"
  ownershipType: string; // e.g. "Single Owner", "Joint Ownership", "Government", "Trust"
  mutationNumber?: string;
  registrationNumber?: string;
  sourceDocument?: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  createdBy: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  confidenceScore: number; // 0.0 to 1.0 (defaults or extracted from future AI)
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LandRecordSchema = new Schema<ILandRecord>(
  {
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      index: true,
    },
    surveyNumber: {
      type: String,
      required: [true, 'Survey number is required'],
      trim: true,
      index: true,
    },
    khasraNumber: {
      type: String,
      required: [true, 'Khasra number is required'],
      trim: true,
      index: true,
    },
    khataNumber: {
      type: String,
      required: [true, 'Khata number is required'],
      trim: true,
      index: true,
    },
    plotArea: {
      type: String,
      required: [true, 'Plot area is required'],
      trim: true,
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true,
      index: true,
    },
    tehsil: {
      type: String,
      required: [true, 'Tehsil is required'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },
    landClassification: {
      type: String,
      required: [true, 'Land classification is required'],
      trim: true,
      default: 'Agricultural',
      index: true,
    },
    ownershipType: {
      type: String,
      required: [true, 'Ownership type is required'],
      trim: true,
      default: 'Single Owner',
    },
    mutationNumber: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
      index: true,
    },
    sourceDocument: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW'],
      default: 'PENDING',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.9,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast multi-attribute filtering & sorting
LandRecordSchema.index({ district: 1, tehsil: 1, village: 1 });
LandRecordSchema.index({ district: 1, verificationStatus: 1 });
LandRecordSchema.index({ surveyNumber: 1, village: 1 });
LandRecordSchema.index({ createdAt: -1 });

// Full text search index
LandRecordSchema.index({
  ownerName: 'text',
  surveyNumber: 'text',
  khasraNumber: 'text',
  village: 'text',
  district: 'text',
});

export const LandRecord = mongoose.model<ILandRecord>('LandRecord', LandRecordSchema);
