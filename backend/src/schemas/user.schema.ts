import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER']),
  department: z.string().min(2, 'Department is required'),
  district: z.string().min(2, 'District is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional().default('ACTIVE'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER']).optional(),
  department: z.string().min(2, 'Department is required').optional(),
  district: z.string().min(2, 'District is required').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export const UserQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  district: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
