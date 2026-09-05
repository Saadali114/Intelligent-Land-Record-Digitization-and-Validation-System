import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export type DocumentProcessingStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'OCR_COMPLETED'
  | 'ANALYSIS_COMPLETED'
  | 'PENDING_OFFICER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'PROCESSED'
  | 'FAILED'
  | 'NEEDS_REVIEW';

export type LandDocumentType = '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER';

export interface IDocument extends MongooseDocument {
  documentId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  language: string;
  uploadedBy: mongoose.Types.ObjectId;
  processingStatus: DocumentProcessingStatus;
  documentTypeEnum?: LandDocumentType;
  checksum?: string;
  version?: number;
  pageCount?: number;
  uploadedAt: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    documentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'Marathi',
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    processingStatus: {
      type: String,
      enum: [
        'UPLOADED',
        'PROCESSING',
        'OCR_COMPLETED',
        'ANALYSIS_COMPLETED',
        'PENDING_OFFICER_REVIEW',
        'ACTION_REQUIRED',
        'VERIFIED',
        'REJECTED',
        'PROCESSED',
        'FAILED',
        'NEEDS_REVIEW',
      ],
      default: 'UPLOADED',
      index: true,
    },
    documentTypeEnum: {
      type: String,
      enum: ['7_12', '8A', 'FERFAR', 'SALE_DEED', 'OTHER'],
      default: '7_12',
      index: true,
    },
    checksum: {
      type: String,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    pageCount: {
      type: Number,
      default: 1,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and dashboard statistics
DocumentSchema.index({ processingStatus: 1, uploadedAt: -1 });
DocumentSchema.index({ language: 1, processingStatus: 1 });
DocumentSchema.index(
  { originalName: 'text', fileName: 'text' },
  { default_language: 'none', language_override: 'dummy_language_override_field' }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
