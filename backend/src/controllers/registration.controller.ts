import { Request, Response } from 'express';
import { RegistrationService } from '../services/registration.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const registerCitizen = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await RegistrationService.registerCitizen(req.body, req.ip);
    sendSuccess(res, result.message, result, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Citizen registration failed', 400);
  }
};

export const registerOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await RegistrationService.registerOfficer(req.body, req.ip);
    sendSuccess(res, result.message, result, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Officer registration failed', 400);
  }
};

export const verifyRegistrationOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await RegistrationService.verifyRegistrationOtp(req.body, req.ip);
    // Set session cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, result.message, result);
  } catch (error: any) {
    sendError(res, error.message || 'Verification failed', 400);
  }
};

export const getOfficerSelfStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    const application = await RegistrationService.getOfficerSelfStatus(req.user._id.toString());
    sendSuccess(res, 'Application status retrieved', application);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch application status', 400);
  }
};

// Admin Controller Handlers

export const listOfficerApplications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, district, search, page, limit } = req.query;
    const result = await RegistrationService.listOfficerApplications({
      status: status as string,
      district: district as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });
    sendSuccess(res, 'Officer applications retrieved successfully', result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to list officer applications', 500);
  }
};

export const getOfficerApplicationById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const application = await RegistrationService.getOfficerApplicationById(req.params.id);
    sendSuccess(res, 'Officer application details retrieved', application);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve application', 404);
  }
};

export const approveOfficerApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    const result = await RegistrationService.approveOfficerApplication(
      req.params.id,
      req.user,
      req.ip
    );
    sendSuccess(res, result.message, result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to approve application', 400);
  }
};

export const rejectOfficerApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    const { reason } = req.body;
    const result = await RegistrationService.rejectOfficerApplication(
      req.params.id,
      reason,
      req.user,
      req.ip
    );
    sendSuccess(res, result.message, result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to reject application', 400);
  }
};

export const requestOfficerClarification = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    const { message } = req.body;
    const result = await RegistrationService.requestOfficerClarification(
      req.params.id,
      message,
      req.user,
      req.ip
    );
    sendSuccess(res, result.message, result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to request clarification', 400);
  }
};
