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
};
