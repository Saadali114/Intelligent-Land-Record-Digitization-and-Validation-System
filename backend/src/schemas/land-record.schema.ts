import { z } from 'zod';

export const CreateLandRecordSchema = z.object({
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  surveyNumber: z.string().min(1, 'Survey number is required'),
  khasraNumber: z.string().min(1, 'Khasra number is required'),
  khataNumber: z.string().min(1, 'Khata number is required'),
  plotArea: z.string().min(1, 'Plot area is required'),
  village: z.string().min(1, 'Village is required'),
  tehsil: z.string().min(1, 'Tehsil is required'),
  district: z.string().min(1, 'District is required'),
  landClassification: z.string().default('Agricultural'),
  ownershipType: z.string().default('Single Owner'),
  mutationNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  sourceDocument: z.string().optional(),
  confidenceScore: z.number().min(0).max(1).optional().default(0.9),
  remarks: z.string().optional(),
});

export const UpdateLandRecordSchema = CreateLandRecordSchema.partial();

export const LandRecordQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  district: z.string().optional(),
  tehsil: z.string().optional(),
  village: z.string().optional(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW']).optional(),
  landClassification: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateLandRecordInput = z.infer<typeof CreateLandRecordSchema>;
export type UpdateLandRecordInput = z.infer<typeof UpdateLandRecordSchema>;
export type LandRecordQueryInput = z.infer<typeof LandRecordQuerySchema>;
