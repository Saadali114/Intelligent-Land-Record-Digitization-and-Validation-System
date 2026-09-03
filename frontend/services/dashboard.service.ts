import apiClient from '../lib/axios';
import { DashboardStats, ApiResponse } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },
};
