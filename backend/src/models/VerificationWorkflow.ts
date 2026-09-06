import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder } from '../config/prismaQuery.js';
import { WorkflowStatus } from '@prisma/client';

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

export { WorkflowStatus };

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

export interface IVerificationWorkflowDocument {
  id: string;
  _id: string;
  applicationId: string;
  userId?: any;
  documentId?: any;
  status: WorkflowStatus;
  casePreset?: string | null;

  applicant: {
    name: string;
    mobile: string;
    email: string;
    identityStatus: IdentityStatus;
    identityMethod: string;
    verifiedAt?: Date;
    demoNote?: string;
  };

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

  ocrData?: {
    language: string;
    rawText: string;
    confidence: number;
    pages?: Array<{
      pageNumber: number;
      text: string;
      confidence: number;
    }>;
  };

  anomalyAnalysis?: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    signals: Array<{
      type: 'VISUAL' | 'METADATA' | 'STRUCTURAL';
      description: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'INFO';
    }>;
  };

  clarificationHistory?: Array<{
    requestedAt: Date;
    officerMessage: string;
    respondedAt?: Date;
    responseText?: string;
    replacementDocumentId?: string;
  }>;

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

  relationshipVerification: {
    status: RelationshipStatus;
    relationshipType: RelationshipType;
    landOwnerName: string;
    applicantName: string;
    evidenceRequired: boolean;
    explanation: string;
  };

  riskAssessment: {
    level: RiskLevel;
    score: number;
    signals: {
      positive: string[];
      negative: string[];
    };
    reasons: string[];
    summary: string;
  };

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

  toObject(): any;
  toJSON(): any;
  save(): Promise<IVerificationWorkflowDocument>;
}

export function enrichWorkflow(raw: any): IVerificationWorkflowDocument | null {
  if (!raw) return null;
  const wf = withMongoId({ ...raw }) as any;

  // Unpack documentData to document if stored that way
  if (raw.documentData && !raw.document) {
    wf.document = raw.documentData;
  }

  wf.toObject = function () {
    return { ...this };
  };

  wf.toJSON = function () {
    return { ...this };
  };

  wf.save = async function (): Promise<IVerificationWorkflowDocument> {
    const cleanUserId = this.userId
      ? typeof this.userId === 'object' && this.userId.toString
        ? this.userId.toString()
        : String(this.userId)
      : null;

    const cleanDocId = this.documentId
      ? typeof this.documentId === 'object' && this.documentId.toString
        ? this.documentId.toString()
        : String(this.documentId)
      : null;

    let targetStatus: WorkflowStatus = 'PENDING_OFFICER_REVIEW';
    if (this.status) targetStatus = this.status as WorkflowStatus;

    if (this.id) {
      const updated = await prisma.verificationWorkflow.update({
        where: { id: this.id },
        data: {
          status: targetStatus,
          casePreset: this.casePreset || null,
          applicant: this.applicant,
          documentData: this.document || {},
          ocrData: this.ocrData || undefined,
          anomalyAnalysis: this.anomalyAnalysis || undefined,
          clarificationHistory: this.clarificationHistory || [],
          officialRecordMatch: this.officialRecordMatch,
          relationshipVerification: this.relationshipVerification,
          riskAssessment: this.riskAssessment,
          officerDecision: this.officerDecision,
          auditTimeline: this.auditTimeline || [],
        },
      });
      return enrichWorkflow(updated)!;
    } else {
      const created = await prisma.verificationWorkflow.create({
        data: {
          applicationId: this.applicationId,
          userId: cleanUserId,
          documentId: cleanDocId,
          status: targetStatus,
          casePreset: this.casePreset || null,
          applicant: this.applicant,
          documentData: this.document || {},
          ocrData: this.ocrData || undefined,
          anomalyAnalysis: this.anomalyAnalysis || undefined,
          clarificationHistory: this.clarificationHistory || [],
          officialRecordMatch: this.officialRecordMatch,
          relationshipVerification: this.relationshipVerification,
          riskAssessment: this.riskAssessment,
          officerDecision: this.officerDecision,
          auditTimeline: this.auditTimeline || [],
        },
      });
      return enrichWorkflow(created)!;
    }
  };

  return wf;
}

export class VerificationWorkflowModel {
  [key: string]: any;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  async save(): Promise<IVerificationWorkflowDocument> {
    return enrichWorkflow(this)!.save();
  }

  static find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IVerificationWorkflowDocument[]>(async ({ skip, take, orderBy }) => {
      const workflows = await prisma.verificationWorkflow.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return workflows.map((w) => enrichWorkflow(w)!);
    });
  }

  static async findOne(filter: any = {}): Promise<IVerificationWorkflowDocument | null> {
    const where = mongoFilterToPrisma(filter);
    const workflow = await prisma.verificationWorkflow.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return enrichWorkflow(workflow);
  }

  static async findById(id: string): Promise<IVerificationWorkflowDocument | null> {
    if (!id) return null;
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const workflow = await prisma.verificationWorkflow.findUnique({
      where: { id: cleanId },
    });
    return enrichWorkflow(workflow);
  }

  static async create(data: any): Promise<IVerificationWorkflowDocument> {
    const instance = new VerificationWorkflowModel(data);
    return instance.save();
  }

  static async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.verificationWorkflow.count({ where });
  }
}

export const VerificationWorkflow = VerificationWorkflowModel;
