import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder } from '../config/prismaQuery.js';

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
  | 'EMAIL_VERIFIED'
  | 'CITIZEN_REGISTRATION_CREATED'
  | 'CITIZEN_EMAIL_VERIFIED'
  | 'OFFICER_APPLICATION_CREATED'
  | 'OFFICER_EMAIL_VERIFIED'
  | 'OFFICER_APPLICATION_REVIEWED'
  | 'OFFICER_APPLICATION_APPROVED'
  | 'OFFICER_APPLICATION_REJECTED'
  | 'USER_ACCOUNT_ACTIVATED'
  | 'USER_ACCOUNT_SUSPENDED'
  | 'DOCUMENT_PROCESSING_STARTED'
  | 'OCR_COMPLETED'
  | 'ENTITIES_EXTRACTED'
  | 'DOCUMENT_TYPE_VALIDATED'
  | 'LAND_RECORD_MATCHED'
  | 'DISCREPANCY_DETECTED'
  | 'ANOMALY_ANALYSIS_COMPLETED'
  | 'RISK_ASSESSMENT_COMPLETED'
  | 'VERIFICATION_SUBMITTED_FOR_REVIEW'
  | 'OFFICER_REVIEW_STARTED'
  | 'OFFICER_VERIFICATION_APPROVED'
  | 'OFFICER_VERIFICATION_REJECTED'
  | 'OFFICER_CLARIFICATION_REQUESTED'
  | 'DOCUMENT_VERIFICATION_INITIATED'
  | 'OFFICER_APPROVED'
  | 'CLARIFICATION_REQUESTED'
  | 'OFFICER_REJECTED'
  | 'CITIZEN_CLARIFICATION_SUBMITTED'
  | 'DECISION_APPROVED'
  | 'DECISION_CLARIFICATION_REQUESTED'
  | 'DECISION_REJECTED'
  | 'DOCUMENT_REPLACED';

export interface IAuditLog {
  id: string;
  _id: string;
  userId?: any;
  userIdVal?: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string | null;
  description: string;
  ipAddress?: string | null;
  timestamp: Date;
  toObject(): any;
  toJSON(): any;
}

export function enrichAuditLog(raw: any): IAuditLog | null {
  if (!raw) return null;
  const log = withMongoId({ ...raw }) as IAuditLog;

  if (raw.user) {
    log.userId = withMongoId(raw.user);
  }

  log.toObject = function () {
    return { ...this };
  };

  log.toJSON = function () {
    return { ...this };
  };

  return log;
}

export const AuditLog = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IAuditLog[]>(async ({ skip, take, orderBy }) => {
      const logs = await prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { timestamp: 'desc' },
        include: {
          user: true,
        },
      });
      return logs.map((l) => enrichAuditLog(l)!);
    });
  },

  async create(data: any): Promise<IAuditLog> {
    const userId = data.userId
      ? typeof data.userId === 'object' && data.userId.toString
        ? data.userId.toString()
        : String(data.userId)
      : null;

    const created = await prisma.auditLog.create({
      data: {
        userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId || null,
        description: data.description || '',
        ipAddress: data.ipAddress || '127.0.0.1',
        timestamp: data.timestamp || new Date(),
      },
      include: {
        user: true,
      },
    });

    return enrichAuditLog(created)!;
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.auditLog.count({ where });
  },
};
