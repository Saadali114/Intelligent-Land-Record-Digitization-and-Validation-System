import { Response } from 'express';
import { getAuditLogsService } from '../services/audit.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const action = req.query.action as string;
    const resourceType = req.query.resourceType as string;

    const { logs, pagination } = await getAuditLogsService({
      page,
      limit,
      action,
      resourceType,
    });

    sendSuccess(res, 'Audit logs retrieved successfully', logs, 200, pagination);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch audit logs', 500);
  }
};
