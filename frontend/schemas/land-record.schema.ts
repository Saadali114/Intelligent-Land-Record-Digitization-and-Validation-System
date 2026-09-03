import { z } from 'zod';

export const LandRecordFormSchema = z.object({
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  surveyNumber: z.string().min(1, 'Survey number is required'),
  khasraNumber: z.string().min(1, 'Khasra number is required'),
  khataNumber: z.string().min(1, 'Khata number is required'),
  plotArea: z.string().min(1, 'Plot area is required (e.g. 2.5 Hectares)'),
  village: z.string().min(1, 'Village name is required'),
  tehsil: z.string().min(1, 'Tehsil name is required'),
  district: z.string().min(1, 'District is required'),
  landClassification: z.string().min(1, 'Classification is required'),
  ownershipType: z.string().min(1, 'Ownership type is required'),
  mutationNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  sourceDocument: z.string().optional(),
  confidenceScore: z.number().min(0).max(1).optional().default(0.9),
  remarks: z.string().optional(),
});

export type LandRecordFormData = z.infer<typeof LandRecordFormSchema>;
