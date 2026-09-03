import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  pagination?: PaginationMeta
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error !== undefined && { error }),
  });
};
