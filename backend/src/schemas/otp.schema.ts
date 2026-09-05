import { z } from 'zod';

export const SendOtpSchema = z.object({
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(16, 'Mobile number is too long'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'MOBILE_VERIFICATION'])
    .optional()
    .default('MOBILE_VERIFICATION'),
});

export const VerifyOtpSchema = z.object({
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(16, 'Mobile number is too long'),
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'MOBILE_VERIFICATION'])
    .optional()
    .default('MOBILE_VERIFICATION'),
});

export const ResendOtpSchema = z.object({
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(16, 'Mobile number is too long'),
  purpose: z
    .enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'MOBILE_VERIFICATION'])
    .optional()
    .default('MOBILE_VERIFICATION'),
});

export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof ResendOtpSchema>;
