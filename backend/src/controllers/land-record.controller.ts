import { Response } from 'express';
import {
  getLandRecordsService,
  getLandRecordByIdService,
  createLandRecordService,
  updateLandRecordService,
  deleteLandRecordService,
  getFilterMetadataService,
} from '../services/land-record.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getLandRecords = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { records, pagination } = await getLandRecordsService(req.query as any);
    sendSuccess(res, 'Land records retrieved successfully', records, 200, pagination);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch land records', 500);
  }
};

export const getLandRecordById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const record = await getLandRecordByIdService(req.params.id);
    sendSuccess(res, 'Land record retrieved successfully', record);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch land record', 404);
  }
};

export const createLandRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const record = await createLandRecordService(req.body, req.user._id.toString(), req.ip);
    sendSuccess(res, 'Land record created successfully', record, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create land record', 400);
  }
};

export const updateLandRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const record = await updateLandRecordService(
      req.params.id,
      req.body,
      req.user._id.toString(),
      req.ip
    );
    sendSuccess(res, 'Land record updated successfully', record);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update land record', 400);
  }
};

export const deleteLandRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const result = await deleteLandRecordService(req.params.id, req.user._id.toString(), req.ip);
    sendSuccess(res, 'Land record deleted successfully', result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete land record', 400);
  }
};

export const getFilterMetadata = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const meta = await getFilterMetadataService();
    sendSuccess(res, 'Filter metadata retrieved successfully', meta);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch filter metadata', 500);
  }
};
