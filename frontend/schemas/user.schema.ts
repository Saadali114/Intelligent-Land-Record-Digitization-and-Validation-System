import { z } from 'zod';

export const UserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'OFFICER', 'VERIFIER']),
  department: z.string().min(2, 'Department is required'),
  district: z.string().min(2, 'District is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export type UserFormData = z.infer<typeof UserFormSchema>;
