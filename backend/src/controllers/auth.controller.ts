import { Request, Response } from 'express';
import { registerUserService, loginUserService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { logAudit } from '../utils/audit.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, token } = await registerUserService(req.body, req.ip);
    res.cookie('token', token, COOKIE_OPTIONS);
    sendSuccess(res, 'User registered successfully', { user, token }, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Registration failed', 400);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, token } = await loginUserService(req.body, req.ip);
    res.cookie('token', token, COOKIE_OPTIONS);
    sendSuccess(res, 'Logged in successfully', { user, token });
  } catch (error: any) {
    sendError(res, error.message || 'Login failed', 401);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    sendSuccess(res, 'Profile retrieved successfully', req.user);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user session', 500);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await logAudit({
        userId: req.user._id as any,
        action: 'USER_LOGOUT',
        resourceType: 'Auth',
        resourceId: req.user._id.toString(),
        description: `User ${req.user.email} logged out`,
        ipAddress: req.ip,
      });
    }
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    sendSuccess(res, 'Logged out successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Logout failed', 500);
  }
};
