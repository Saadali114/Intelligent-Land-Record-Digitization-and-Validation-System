import { Response } from 'express';
import {
  getVerificationQueueService,
  getVerificationHistoryService,
  verifyRecordService,
} from '../services/verification.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getVerificationQueue = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const district = req.query.district as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { records, pagination } = await getVerificationQueueService({
      page,
      limit,
      district,
      status,
      search,
    });

    sendSuccess(res, 'Verification queue retrieved successfully', records, 200, pagination);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch verification queue', 500);
  }
};

export const getVerificationHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const history = await getVerificationHistoryService(req.params.recordId);
    sendSuccess(res, 'Verification history retrieved successfully', history);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch verification history', 500);
  }
};

export const verifyRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const result = await verifyRecordService(
      req.params.recordId,
      req.body,
      req.user._id.toString(),
      req.ip
    );

    sendSuccess(res, `Record marked as ${req.body.action.toLowerCase()}`, result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to execute verification', 400);
  }
};
