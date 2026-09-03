import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { UserRole } from '../models/User.js';
import { sendError } from '../utils/response.js';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required before authorization check.', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to perform this operation.`,
        403
      );
      return;
    }

    next();
  };
};
