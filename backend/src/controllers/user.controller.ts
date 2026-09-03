import { Response } from 'express';
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  updateUserStatusService,
  deleteUserService,
} from '../services/user.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { users, pagination } = await getUsersService(req.query as any);
    sendSuccess(res, 'Users retrieved successfully', users, 200, pagination);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserByIdService(req.params.id);
    sendSuccess(res, 'User retrieved successfully', user);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user', 404);
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await createUserService(req.body, req.user?._id?.toString(), req.ip);
    sendSuccess(res, 'User created successfully', user, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create user', 400);
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await updateUserService(
      req.params.id,
      req.body,
      req.user?._id?.toString(),
      req.ip
    );
    sendSuccess(res, 'User updated successfully', user);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update user', 400);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await updateUserStatusService(
      req.params.id,
      req.body.status,
      req.user?._id?.toString(),
      req.ip
    );
    sendSuccess(res, 'User status updated successfully', user);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update user status', 400);
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteUserService(req.params.id, req.user?._id?.toString(), req.ip);
    sendSuccess(res, 'User deleted successfully', result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete user', 400);
  }
};
