import { z } from 'zod';

export const DocumentQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  language: z.string().optional(),
  status: z
    .enum([
      'UPLOADED',
      'PROCESSING',
      'OCR_COMPLETED',
      'ANALYSIS_COMPLETED',
      'PENDING_OFFICER_REVIEW',
      'ACTION_REQUIRED',
      'PROCESSED',
      'VERIFIED',
      'REJECTED',
      'FAILED',
      'NEEDS_REVIEW',
    ])
    .optional(),
  sortBy: z.string().optional().default('uploadedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const DocumentUploadMetaSchema = z.object({
  language: z.string().default('Marathi'),
  fileType: z.string().default('7/12 Extract'),
});

export type DocumentQueryInput = z.infer<typeof DocumentQuerySchema>;
export type DocumentUploadMetaInput = z.infer<typeof DocumentUploadMetaSchema>;
