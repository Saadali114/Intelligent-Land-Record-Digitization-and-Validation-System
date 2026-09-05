import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CitizenRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    preferredLanguage: z.enum(['en', 'mr', 'hi']).default('en').optional(),
    phone: z.string().trim().optional().nullable(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service and Privacy Policy.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type CitizenRegisterInput = z.infer<typeof CitizenRegisterSchema>;

export const OfficerRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Invalid official email address').toLowerCase(),
    employeeId: z.string().trim().min(2, 'Employee ID must be at least 2 characters').max(50),
    department: z.string().trim().min(2, 'Department is required').max(100),
    designation: z.string().trim().min(2, 'Designation is required').max(100),
    office: z.string().trim().min(2, 'Office name is required').max(100),
    district: z.string().trim().min(2, 'District is required').max(100),
    taluka: z.string().trim().optional(),
    phone: z.string().trim().optional().nullable(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    preferredLanguage: z.enum(['en', 'mr', 'hi']).default('en').optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service and Privacy Policy.' }),
    }),
    confirmOfficerApplication: z.literal(true, {
      errorMap: () => ({
        message: 'You must confirm that your officer information is accurate for authorized access.',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type OfficerRegisterInput = z.infer<typeof OfficerRegisterSchema>;

export const VerifyRegistrationOtpSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  otp: z.string().trim().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Must be 6 digits'),
  registrationType: z.enum(['CITIZEN', 'OFFICER']).default('CITIZEN'),
});

export type VerifyRegistrationOtpInput = z.infer<typeof VerifyRegistrationOtpSchema>;

export const RejectOfficerSchema = z.object({
  reason: z.string().trim().min(5, 'Rejection reason must be at least 5 characters').max(500),
});

export type RejectOfficerInput = z.infer<typeof RejectOfficerSchema>;

export const ClarificationOfficerSchema = z.object({
  message: z.string().trim().min(5, 'Clarification message must be at least 5 characters').max(500),
});

export type ClarificationOfficerInput = z.infer<typeof ClarificationOfficerSchema>;
