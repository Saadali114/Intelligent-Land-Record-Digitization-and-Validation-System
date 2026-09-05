import { z } from 'zod';

export const SendEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'])
    .optional()
    .default('EMAIL_VERIFICATION'),
});

export const VerifyEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Verification code must be exactly 6 digits'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'])
    .optional()
    .default('EMAIL_VERIFICATION'),
});

export const ResendEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'])
    .optional()
    .default('EMAIL_VERIFICATION'),
});

export type SendEmailOtpInput = z.infer<typeof SendEmailOtpSchema>;
export type VerifyEmailOtpInput = z.infer<typeof VerifyEmailOtpSchema>;
export type ResendEmailOtpInput = z.infer<typeof ResendEmailOtpSchema>;
