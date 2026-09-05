import apiClient from '../lib/axios';
import { User, ApiResponse } from '../types';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const authService = {
  login: async (credentials: LoginFormData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  register: async (data: RegisterFormData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Real Email OTP API methods (Resend / Dev Backend Integration)
  sendEmailOtp: async (
    email: string,
    purpose: string = 'EMAIL_VERIFICATION'
  ): Promise<{ email: string; expiresIn: number; resendAvailableIn: number; message: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ email: string; expiresIn: number; resendAvailableIn: number; purpose: string }>
    >('/auth/email-otp/send', { email, purpose });
    return {
      email: response.data.data.email,
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      message: response.data.message,
    };
  },

  verifyEmailOtp: async (
    email: string,
    otp: string,
    purpose: string = 'EMAIL_VERIFICATION'
  ): Promise<{ verified: boolean; email: string; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ verified: boolean; email: string; purpose: string }>>(
      '/auth/email-otp/verify',
      { email, otp, purpose }
    );
    return {
      verified: response.data.data.verified,
      email: response.data.data.email,
      message: response.data.message,
    };
  },

  resendEmailOtp: async (
    email: string,
    purpose: string = 'EMAIL_VERIFICATION'
  ): Promise<{ email: string; expiresIn: number; resendAvailableIn: number; message: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ email: string; expiresIn: number; resendAvailableIn: number; purpose: string }>
    >('/auth/email-otp/resend', { email, purpose });
    return {
      email: response.data.data.email,
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      message: response.data.message,
    };
  },

  // Real SMS OTP API methods (MSG91 Backend Integration - Legacy/Optional)
  sendOtp: async (
    mobile: string,
    purpose: string = 'MOBILE_VERIFICATION'
  ): Promise<{ expiresIn: number; resendAvailableIn: number; message: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ expiresIn: number; resendAvailableIn: number }>
    >('/auth/otp/send', { mobile, purpose });
    return {
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      message: response.data.message,
    };
  },

  verifyOtp: async (
    mobile: string,
    otp: string,
    purpose: string = 'MOBILE_VERIFICATION'
  ): Promise<{ verified: boolean; mobile: string; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ verified: boolean; mobile: string }>>(
      '/auth/otp/verify',
      { mobile, otp, purpose }
    );
    return {
      verified: response.data.data.verified,
      mobile: response.data.data.mobile,
      message: response.data.message,
    };
  },

  resendOtp: async (
    mobile: string,
    purpose: string = 'MOBILE_VERIFICATION'
  ): Promise<{ expiresIn: number; resendAvailableIn: number; message: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ expiresIn: number; resendAvailableIn: number }>
    >('/auth/otp/resend', { mobile, purpose });
    return {
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      message: response.data.message,
    };
  },
};
