import { AuditLog, AuditAction } from '../models/AuditLog.js';

interface CreateAuditParams {
  userId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
}

export const logAudit = async (params: CreateAuditParams): Promise<void> => {
  try {
    await AuditLog.create({
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      description: params.description,
      ipAddress: params.ipAddress || '127.0.0.1',
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
};
