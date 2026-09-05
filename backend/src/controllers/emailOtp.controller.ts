import { Request, Response } from 'express';
import { EmailOTPService } from '../services/emailOtp.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const sendEmailOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, purpose } = req.body;
    const result = await EmailOTPService.requestEmailOTP(email, purpose, req.ip);

    if (!result.success) {
      sendError(res, result.message, 400, { resendAvailableIn: result.resendAvailableIn });
      return;
    }

    sendSuccess(res, result.message, {
      expiresIn: result.expiresIn,
      resendAvailableIn: result.resendAvailableIn,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to dispatch verification email', 500);
  }
};

export const verifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, purpose } = req.body;
    const result = await EmailOTPService.verifyEmailOTP(email, otp, purpose, req.ip);

    if (!result.verified) {
      sendError(res, result.message, 400, { verified: false });
      return;
    }

    sendSuccess(res, result.message, {
      verified: true,
      email: result.email,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Email OTP verification failed', 500);
  }
};

export const resendEmailOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, purpose } = req.body;
    const result = await EmailOTPService.resendEmailOTP(email, purpose, req.ip);

    if (!result.success) {
      sendError(res, result.message, 400, { resendAvailableIn: result.resendAvailableIn });
      return;
    }

    sendSuccess(res, result.message, {
      expiresIn: result.expiresIn,
      resendAvailableIn: result.resendAvailableIn,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to resend verification code', 500);
  }
};
