import { Request, Response } from 'express';
import { OTPService } from '../services/otp.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, purpose } = req.body;
    const result = await OTPService.requestOTP(mobile, purpose, req.ip);

    if (!result.success) {
      sendError(res, result.message, 400, { resendAvailableIn: result.resendAvailableIn });
      return;
    }

    sendSuccess(res, result.message, {
      expiresIn: result.expiresIn,
      resendAvailableIn: result.resendAvailableIn,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to dispatch OTP', 500);
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, otp, purpose } = req.body;
    const result = await OTPService.verifyOTP(mobile, otp, purpose, req.ip);

    if (!result.verified) {
      sendError(res, result.message, 400, { verified: false });
      return;
    }

    sendSuccess(res, result.message, {
      verified: true,
      mobile,
    });
  } catch (error: any) {
    sendError(res, error.message || 'OTP verification failed', 500);
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, purpose } = req.body;
    const result = await OTPService.resendOTP(mobile, purpose, req.ip);

    if (!result.success) {
      sendError(res, result.message, 400, { resendAvailableIn: result.resendAvailableIn });
      return;
    }

    sendSuccess(res, result.message, {
      expiresIn: result.expiresIn,
      resendAvailableIn: result.resendAvailableIn,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to resend OTP', 500);
  }
};
