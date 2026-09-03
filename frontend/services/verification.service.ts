import apiClient from '../lib/axios';
import { LandRecord, VerificationRecord, Pagination, ApiResponse } from '../types';
import { VerificationActionFormData } from '../schemas/verification.schema';

export interface VerificationQueueParams {
  page?: number;
  limit?: number;
  district?: string;
  status?: string;
  search?: string;
}

export const verificationService = {
  getQueue: async (
    params?: VerificationQueueParams
  ): Promise<{ records: LandRecord[]; pagination: Pagination }> => {
    const response = await apiClient.get<ApiResponse<LandRecord[]>>('/verification/queue', {
      params,
    });
    return {
      records: response.data.data,
      pagination: response.data.pagination!,
    };
  },

  getHistory: async (recordId: string): Promise<VerificationRecord[]> => {
    const response = await apiClient.get<ApiResponse<VerificationRecord[]>>(
      `/verification/history/${recordId}`
    );
    return response.data.data;
  },

  verifyRecord: async (
    recordId: string,
    data: VerificationActionFormData
  ): Promise<{ record: LandRecord; verificationEntry: VerificationRecord }> => {
    const response = await apiClient.post<
      ApiResponse<{ record: LandRecord; verificationEntry: VerificationRecord }>
    >(`/verification/${recordId}`, data);
    return response.data.data;
  },
};
