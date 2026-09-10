import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.js';
import { sendError } from '../utils/response.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'Authentication required. No token provided.', 401);
      return;
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_land_records_2026_secure';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      sendError(res, 'User session invalid. Account not found.', 401);
      return;
    }

    if (user.status !== 'ACTIVE' && user.accountStatus !== 'PENDING_APPROVAL') {
      sendError(res, `Account is ${user.status.toLowerCase()}. Access denied.`, 403);
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Session has expired. Please log in again.', 401);
      return;
    }
    sendError(res, 'Invalid authentication token.', 401);
  }
};
