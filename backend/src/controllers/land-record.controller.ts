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

export const getLandStack = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { getLandStackData } = await import('../services/landStack.service.js');
    const stack = await getLandStackData(req.params.id);
    if (!stack) {
      sendError(res, 'Land record not found for Land Stack projection', 404);
      return;
    }
    sendSuccess(res, 'Land Stack 8-layer geospatial data retrieved successfully', stack);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to generate Land Stack data', 500);
  }
};

export const seedAadhaar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const { aadhaarNumber, consentGiven } = req.body;
    if (!consentGiven) {
      sendError(res, 'Explicit statutory consent is mandatory under Section 2.2.3 of DILRMP 3.0', 400);
      return;
    }
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber.replace(/\s/g, ''))) {
      sendError(res, 'Valid 12-digit Aadhaar number required', 400);
      return;
    }

    const clean = aadhaarNumber.replace(/\s/g, '');
    const masked = `XXXX-XXXX-${clean.slice(-4)}`;

    const { LandRecord } = await import('../models/LandRecord.js');
    const record = await LandRecord.findById(req.params.id);
    if (!record) {
      sendError(res, 'Land record not found', 404);
      return;
    }

    record.isAadhaarSeeded = true;
    record.aadhaarMasked = masked;
    await record.save();

    // Log audit
    const { logAudit } = await import('../utils/audit.js');
    await logAudit({
      userId: req.user._id.toString() as any,
      action: 'RECORD_CORRECTED',
      resourceType: 'LandRecord',
      resourceId: record._id.toString(),
      description: `Consent-based voluntary Aadhaar seeded for parcel (${record.surveyNumber}): ${masked}`,
      ipAddress: req.ip,
    });

    sendSuccess(res, 'Aadhaar successfully seeded with Record of Rights (RoR)', record);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to seed Aadhaar', 500);
  }
};

export const updateBankCharge = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const { hasBankCharge, bankName, loanAmount, chargeType, branch } = req.body;
    const { LandRecord } = await import('../models/LandRecord.js');
    const record = await LandRecord.findById(req.params.id);
    if (!record) {
      sendError(res, 'Land record not found', 404);
      return;
    }

    record.hasBankCharge = Boolean(hasBankCharge);
    if (hasBankCharge) {
      record.bankChargeDetails = {
        bankName: bankName || 'State Bank of India',
        branch: branch || `${record.tehsil} Commercial Branch`,
        loanAmount: Number(loanAmount) || 500000,
        chargeType: chargeType || 'Institutional Mortgage / Crop Loan Lien',
        sanctionDate: new Date().toLocaleDateString('en-IN'),
        status: 'ACTIVE',
      };
    } else {
      record.bankChargeDetails = null;
    }
    await record.save();

    sendSuccess(res, 'Bank charge & mortgage lien status updated successfully', record);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update bank charge', 500);
  }
};
