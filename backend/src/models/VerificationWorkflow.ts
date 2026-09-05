import mongoose, { Schema, Document } from 'mongoose';

export type IdentityStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type ConsistencyStatus = 'PASSED' | 'WARNING' | 'FAILED';
export type MatchStatus = 'STRONG_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'NOT_FOUND';
export type RelationshipType =
  | 'OWNER'
  | 'CO_OWNER'
  | 'LEGAL_HEIR'
  | 'AUTHORIZED_REPRESENTATIVE'
  | 'TENANT'
  | 'OTHER'
  | 'NOT_ESTABLISHED';
export type RelationshipStatus = 'MATCHED' | 'EVIDENCE_REQUIRED' | 'NOT_ESTABLISHED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type OfficerDecisionType = 'PENDING' | 'APPROVED' | 'CLARIFICATION_REQUESTED' | 'REJECTED';

export interface IAuditTimelineEntry {
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  description: string;
}

export interface IExtractedField {
  label: string;
  value: string;
  confidence: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IConsistencyCheckItem {
  id: string;
  name: string;
  passed: boolean;
  notes: string;
}

export interface IOfficialRecordMatchField {
  fieldName: string;
  uploadedValue: string;
  officialValue: string;
  isMatch: boolean;
}

export interface IVerificationWorkflowDocument extends Document {
  applicationId: string;
  casePreset?: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED';
  
  // 1. Identity Pillar
  applicant: {
    name: string;
    mobile: string;
    email: string;
    identityStatus: IdentityStatus;
    identityMethod: string;
    verifiedAt?: Date;
    demoNote?: string;
  };

  // 2. Document & Quality Pillar
  document: {
    documentType: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    uploadedAt: Date;
    ocrEngine: string;
    avgConfidence: number;
    extractedFields: Record<string, IExtractedField>;
    consistency: {
      status: ConsistencyStatus;
      summary: string;
      checks: IConsistencyCheckItem[];
      visualAnomaliesDetected: boolean;
      anomalyNotes?: string;
    };
  };

  // 3. Official Cadastral Match Pillar
  officialRecordMatch: {
    status: MatchStatus;
    matchedRecordId?: string;
    matchedVillage: string;
    matchedTaluka: string;
    matchedDistrict: string;
    matchedSurveyNumber: string;
    fieldComparisons: IOfficialRecordMatchField[];
    summary: string;
  };

  // 4. User ↔ Land Relationship Pillar
  relationshipVerification: {
    status: RelationshipStatus;
    relationshipType: RelationshipType;
    landOwnerName: string;
    applicantName: string;
    evidenceRequired: boolean;
    explanation: string;
  };

  // Risk & Discrepancy Engine
  riskAssessment: {
    level: RiskLevel;
    score: number; // 0 to 100
    signals: {
      positive: string[];
      negative: string[];
    };
    reasons: string[];
    summary: string;
  };

  // Officer Review
  officerDecision: {
    status: OfficerDecisionType;
    officerId?: string;
    officerName?: string;
    remarks?: string;
    decidedAt?: Date;
  };

  auditTimeline: IAuditTimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const VerificationWorkflowSchema = new Schema<IVerificationWorkflowDocument>(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    casePreset: { type: String, enum: ['CASE_1_GREEN', 'CASE_2_YELLOW', 'CASE_3_RED'] },

    applicant: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, default: '' },
      identityStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'FAILED'], default: 'PENDING' },
      identityMethod: { type: String, default: 'OTP_REGISTERED_MOBILE' },
      verifiedAt: { type: Date },
      demoNote: { type: String, default: 'Prototype Verification Environment (Registered Account + OTP)' },
    },

    document: {
      documentType: { type: String, required: true },
      fileName: { type: String, required: true },
      fileSize: { type: String, default: '1.8 MB' },
      fileUrl: { type: String, default: '/sample-712-extract.png' },
      uploadedAt: { type: Date, default: Date.now },
      ocrEngine: { type: String, default: 'Cadastral Tesseract OCR v5.3 + Vision AI' },
      avgConfidence: { type: Number, default: 0.95 },
      extractedFields: { type: Schema.Types.Mixed, default: {} },
      consistency: {
        status: { type: String, enum: ['PASSED', 'WARNING', 'FAILED'], default: 'PASSED' },
        summary: { type: String, default: 'No significant document-level discrepancy detected.' },
        checks: [
          {
            id: String,
            name: String,
            passed: Boolean,
            notes: String,
          },
        ],
        visualAnomaliesDetected: { type: Boolean, default: false },
        anomalyNotes: String,
      },
    },

    officialRecordMatch: {
      status: { type: String, enum: ['STRONG_MATCH', 'PARTIAL_MATCH', 'MISMATCH', 'NOT_FOUND'], default: 'STRONG_MATCH' },
      matchedRecordId: String,
      matchedVillage: String,
      matchedTaluka: String,
      matchedDistrict: String,
      matchedSurveyNumber: String,
      fieldComparisons: [
        {
          fieldName: String,
          uploadedValue: String,
          officialValue: String,
          isMatch: Boolean,
        },
      ],
      summary: { type: String, default: 'Official cadastral record matched.' },
    },

    relationshipVerification: {
      status: { type: String, enum: ['MATCHED', 'EVIDENCE_REQUIRED', 'NOT_ESTABLISHED'], default: 'MATCHED' },
      relationshipType: {
        type: String,
        enum: ['OWNER', 'CO_OWNER', 'LEGAL_HEIR', 'AUTHORIZED_REPRESENTATIVE', 'TENANT', 'OTHER', 'NOT_ESTABLISHED'],
        default: 'OWNER',
      },
      landOwnerName: { type: String, required: true },
      applicantName: { type: String, required: true },
      evidenceRequired: { type: Boolean, default: false },
      explanation: { type: String, default: '' },
    },

    riskAssessment: {
      level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
      score: { type: Number, default: 15 },
      signals: {
        positive: [String],
        negative: [String],
      },
      reasons: [String],
      summary: { type: String, default: '' },
    },

    officerDecision: {
      status: { type: String, enum: ['PENDING', 'APPROVED', 'CLARIFICATION_REQUESTED', 'REJECTED'], default: 'PENDING' },
      officerId: String,
      officerName: String,
      remarks: String,
      decidedAt: Date,
    },

    auditTimeline: [
      {
        timestamp: { type: String, required: true },
        action: { type: String, required: true },
        actor: { type: String, required: true },
        actorRole: { type: String, default: 'SYSTEM' },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const VerificationWorkflow = mongoose.model<IVerificationWorkflowDocument>(
  'VerificationWorkflow',
  VerificationWorkflowSchema
);
