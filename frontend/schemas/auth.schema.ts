import { z } from 'zod';
import i18n from '../lib/i18n';

export const getLoginSchema = (t: (key: string, options?: any) => string = (key, opts) => i18n.t(key, opts) as string) =>
  z.object({
    email: z.string().email(t('validation.validEmail', { defaultValue: 'Please enter a valid email address' })),
    password: z.string().min(6, t('validation.passwordMinLength', { defaultValue: 'Password must be at least 6 characters long' })),
  });

export const getRegisterSchema = (t: (key: string, options?: any) => string = (key, opts) => i18n.t(key, opts) as string) =>
  z.object({
    name: z.string().min(2, t('validation.nameMinLength', { defaultValue: 'Name must be at least 2 characters' })),
    email: z.string().email(t('validation.validEmail', { defaultValue: 'Please enter a valid email address' })),
    password: z.string().min(6, t('validation.passwordMinLength', { defaultValue: 'Password must be at least 6 characters' })),
    role: z.enum(['OFFICER', 'VERIFIER']),
    department: z.string().min(2, t('validation.departmentRequired', { defaultValue: 'Department is required' })),
    district: z.string().min(2, t('validation.districtRequired', { defaultValue: 'District is required' })),
  });

export const LoginSchema = getLoginSchema();
export const RegisterSchema = getRegisterSchema();

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

