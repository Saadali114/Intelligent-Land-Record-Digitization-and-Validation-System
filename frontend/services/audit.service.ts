import apiClient from '../lib/axios';
import { AuditLog, Pagination, ApiResponse } from '../types';

export const auditService = {
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    resourceType?: string;
  }): Promise<{ logs: AuditLog[]; pagination: Pagination }> => {
    const response = await apiClient.get<ApiResponse<AuditLog[]>>('/audit', { params });
    return {
      logs: response.data.data,
      pagination: response.data.pagination!,
    };
  },
};
