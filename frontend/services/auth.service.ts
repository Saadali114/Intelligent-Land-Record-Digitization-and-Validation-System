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
  ): Promise<{ verified: boolean; email: string; message: string; token?: string; user?: User }> => {
    const response = await apiClient.post<ApiResponse<{ verified: boolean; email: string; purpose: string; token?: string; user?: User }>>(
      '/auth/email-otp/verify',
      { email, otp, purpose }
    );
    return {
      verified: response.data.data.verified,
      email: response.data.data.email,
      token: response.data.data.token,
      user: response.data.data.user,
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

  // Dedicated Citizen & Officer Registration APIs
  registerCitizen: async (data: any): Promise<{ email: string; expiresIn: number; resendAvailableIn: number; message: string; otp?: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ email: string; expiresIn: number; resendAvailableIn: number; otp?: string }>
    >('/auth/register/citizen', data);
    return {
      email: response.data.data.email,
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      otp: response.data.data.otp,
      message: response.data.message,
    };
  },

  registerOfficer: async (data: any): Promise<{ email: string; employeeId: string; expiresIn: number; resendAvailableIn: number; message: string; otp?: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ email: string; employeeId: string; expiresIn: number; resendAvailableIn: number; otp?: string }>
    >('/auth/register/officer', data);
    return {
      email: response.data.data.email,
      employeeId: response.data.data.employeeId,
      expiresIn: response.data.data.expiresIn,
      resendAvailableIn: response.data.data.resendAvailableIn,
      otp: response.data.data.otp,
      message: response.data.message,
    };
  },

  verifyRegistrationOtp: async (data: {
    email: string;
    otp: string;
    registrationType: 'CITIZEN' | 'OFFICER';
  }): Promise<{ user: User; token: string; role: string; accountStatus: string; message: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string; role: string; accountStatus: string }>
    >('/auth/verify-registration-otp', data);
    return {
      user: response.data.data.user,
      token: response.data.data.token,
      role: response.data.data.role,
      accountStatus: response.data.data.accountStatus,
      message: response.data.message,
    };
  },

  getOfficerSelfStatus: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/officer/status');
    return response.data.data;
  },

  // Admin Officer Applications APIs
  listOfficerApplications: async (params?: {
    status?: string;
    district?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: any[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
    const response = await apiClient.get<
      ApiResponse<{ applications: any[]; pagination: { total: number; page: number; limit: number; pages: number } }>
    >('/admin/officer-applications', { params });
    return response.data.data;
  },

  getOfficerApplicationById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/admin/officer-applications/${id}`);
    return response.data.data;
  },

  approveOfficerApplication: async (id: string): Promise<{ success: boolean; message: string; application: any }> => {
    const response = await apiClient.post<ApiResponse<{ application: any }>>(
      `/admin/officer-applications/${id}/approve`
    );
    return {
      success: true,
      message: response.data.message,
      application: response.data.data.application,
    };
  },

  rejectOfficerApplication: async (id: string, reason: string): Promise<{ success: boolean; message: string; application: any }> => {
    const response = await apiClient.post<ApiResponse<{ application: any }>>(
      `/admin/officer-applications/${id}/reject`,
      { reason }
    );
    return {
      success: true,
      message: response.data.message,
      application: response.data.data.application,
    };
  },

  requestOfficerClarification: async (id: string, message: string): Promise<{ success: boolean; message: string; application: any }> => {
    const response = await apiClient.post<ApiResponse<{ application: any }>>(
      `/admin/officer-applications/${id}/request-clarification`,
      { message }
    );
    return {
      success: true,
      message: response.data.message,
      application: response.data.data.application,
    };
  },
};

