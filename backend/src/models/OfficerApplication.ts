import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type OfficerApplicationStatus =
  | 'PENDING_EMAIL_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED';

export interface IOfficerApplication extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  requestedRole: 'OFFICER';
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  office: string;
  district: string;
  taluka?: string;
  phone?: string;
  preferredLanguage: string;
  emailVerified: boolean;
  status: OfficerApplicationStatus;
  rejectionReason?: string;
  clarificationMessage?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerApplicationSchema = new Schema<IOfficerApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    requestedRole: {
      type: String,
      enum: ['OFFICER'],
      default: 'OFFICER',
    },
    name: {
      type: String,
      required: [true, 'Officer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee / Officer ID is required'],
      trim: true,
      unique: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    office: {
      type: String,
      required: [true, 'Office name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },
    taluka: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'PENDING_EMAIL_VERIFICATION',
        'PENDING_APPROVAL',
        'UNDER_REVIEW',
        'ACTION_REQUIRED',
        'APPROVED',
        'REJECTED',
      ],
      default: 'PENDING_EMAIL_VERIFICATION',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    clarificationMessage: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

OfficerApplicationSchema.index({ status: 1, createdAt: -1 });
OfficerApplicationSchema.index({ district: 1, status: 1 });

export const OfficerApplication = mongoose.model<IOfficerApplication>(
  'OfficerApplication',
  OfficerApplicationSchema
);
