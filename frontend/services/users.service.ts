import apiClient from '../lib/axios';
import { User, Pagination, ApiResponse } from '../types';
import { UserFormData } from '../schemas/user.schema';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  district?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const usersService = {
  getUsers: async (params?: UserQueryParams): Promise<{ users: User[]; pagination: Pagination }> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return {
      users: response.data.data,
      pagination: response.data.pagination!,
    };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: UserFormData): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<UserFormData>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  updateUserStatus: async (id: string, status: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { status });
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
