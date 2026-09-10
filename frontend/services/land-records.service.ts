import apiClient from '../lib/axios';
import { LandRecord, Pagination, ApiResponse, LandStackResponse } from '../types';
import { LandRecordFormData } from '../schemas/land-record.schema';

export interface LandRecordQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
  tehsil?: string;
  village?: string;
  status?: string;
  landClassification?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  ulpin?: string;
  hasActiveDispute?: boolean;
  hasBankCharge?: boolean;
  isLegacyRecord?: boolean;
}

export const landRecordsService = {
  getLandRecords: async (
    params?: LandRecordQueryParams
  ): Promise<{ records: LandRecord[]; pagination: Pagination }> => {
    const response = await apiClient.get<ApiResponse<LandRecord[]>>('/land-records', { params });
    return {
      records: response.data.data,
      pagination: response.data.pagination!,
    };
  },

  getLandRecordById: async (id: string): Promise<LandRecord> => {
    const response = await apiClient.get<ApiResponse<LandRecord>>(`/land-records/${id}`);
    return response.data.data;
  },

  getLandStack: async (id: string): Promise<LandStackResponse> => {
    const response = await apiClient.get<ApiResponse<LandStackResponse>>(`/land-records/${id}/land-stack`);
    return response.data.data;
  },

  seedAadhaar: async (id: string, aadhaarNumber: string, mobileNumber: string, consent: boolean) => {
    const response = await apiClient.post<ApiResponse<any>>(`/land-records/${id}/seed-aadhaar`, {
      aadhaarNumber,
      mobileNumber,
      consent,
    });
    return response.data.data;
  },

  updateBankCharge: async (
    id: string,
    chargeData: {
      hasBankCharge: boolean;
      bankName?: string;
      branch?: string;
      loanAmount?: number;
      chargeType?: string;
    }
  ) => {
    const response = await apiClient.post<ApiResponse<any>>(`/land-records/${id}/bank-charge`, chargeData);
    return response.data.data;
  },

  createLandRecord: async (data: LandRecordFormData): Promise<LandRecord> => {
    const response = await apiClient.post<ApiResponse<LandRecord>>('/land-records', data);
    return response.data.data;
  },

  updateLandRecord: async (id: string, data: Partial<LandRecordFormData>): Promise<LandRecord> => {
    const response = await apiClient.put<ApiResponse<LandRecord>>(`/land-records/${id}`, data);
    return response.data.data;
  },

  deleteLandRecord: async (id: string): Promise<void> => {
    await apiClient.delete(`/land-records/${id}`);
  },

  getFilterMetadata: async (): Promise<{ districts: string[]; classifications: string[] }> => {
    const response = await apiClient.get<ApiResponse<{ districts: string[]; classifications: string[] }>>(
      '/land-records/meta/filters'
    );
    return response.data.data;
  },
};
