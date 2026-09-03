import { z } from 'zod';

export const VerificationActionSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED', 'CORRECTED']),
  remarks: z.string().min(3, 'Remarks are required (minimum 3 characters)'),
  correctedData: z
    .object({
      ownerName: z.string().optional(),
      surveyNumber: z.string().optional(),
      khasraNumber: z.string().optional(),
      khataNumber: z.string().optional(),
      plotArea: z.string().optional(),
      village: z.string().optional(),
      tehsil: z.string().optional(),
      district: z.string().optional(),
      landClassification: z.string().optional(),
      ownershipType: z.string().optional(),
    })
    .optional(),
});

export type VerificationActionFormData = z.infer<typeof VerificationActionSchema>;
