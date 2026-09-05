import { Request, Response } from 'express';
import {
  createVerificationSession,
  getVerificationSession,
  submitOfficerDecision,
  DEMO_PRESET_CASES,
  OFFICIAL_CADASTRAL_REGISTRY,
} from '../services/verificationWorkflow.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const startVerificationSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await createVerificationSession(req.body);
    sendSuccess(res, 'Verification session initialized', session, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to start verification session', 500);
  }
};

export const getVerificationSessionDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await getVerificationSession(req.params.id);
    if (!session) {
      sendError(res, 'Verification session not found', 404);
      return;
    }
    sendSuccess(res, 'Verification details retrieved', session);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve session', 500);
  }
};

export const recordOfficerDecision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { decision, remarks, officerName, officerId } = req.body;
    if (!decision || !remarks) {
      sendError(res, 'Decision and remarks are mandatory', 400);
      return;
    }

    const updated = await submitOfficerDecision(req.params.id, {
      decision,
      remarks,
      officerId: officerId || 'OFF-PUN-014',
      officerName: officerName || 'Tahsildar P. R. Joshi',
    });

    sendSuccess(res, 'Officer decision recorded successfully', updated);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to record decision', 500);
  }
};

export const getDemoCases = async (_req: Request, res: Response): Promise<void> => {
  sendSuccess(res, 'Demo cases retrieved', {
    cases: DEMO_PRESET_CASES,
    officialRegistry: OFFICIAL_CADASTRAL_REGISTRY,
  });
};
