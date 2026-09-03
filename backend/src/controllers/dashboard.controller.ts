import { Response } from 'express';
import { getDashboardStatsService } from '../services/dashboard.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const stats = await getDashboardStatsService();
    sendSuccess(res, 'Dashboard statistics retrieved successfully', stats);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch dashboard statistics', 500);
  }
};
