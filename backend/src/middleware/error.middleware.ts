import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, `Duplicate value entered for ${field}. Must be unique.`, 400);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    sendError(res, 'Database validation error', 400, messages);
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, `Resource not found with identifier '${err.value}'`, 404);
    return;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    sendError(res, `File upload error: ${err.message}`, 400);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
