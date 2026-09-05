import { Request, Response } from 'express';
import { EmailOTPService } from '../services/emailOtp.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { User } from '../models/User.js';
import { generateToken } from '../services/auth.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

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
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const result = await EmailOTPService.verifyEmailOTP(normalizedEmail, otp, purpose, req.ip);

    if (!result.verified) {
      sendError(res, result.message, 400, { verified: false });
      return;
    }

    let token: string | undefined = undefined;
    let userPayload: any = undefined;

    if (purpose === 'LOGIN') {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        token = generateToken(user);
        userPayload = user.toJSON();
        res.cookie('token', token, COOKIE_OPTIONS);
      }
    }

    sendSuccess(res, result.message, {
      verified: true,
      email: result.email,
      token,
      user: userPayload,
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
