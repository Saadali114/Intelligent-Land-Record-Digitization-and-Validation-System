import apiClient from '../lib/axios';
import { DocumentRecord, Pagination, ApiResponse } from '../types';

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const documentsService = {
  getDocuments: async (
    params?: DocumentQueryParams
  ): Promise<{ documents: DocumentRecord[]; pagination: Pagination }> => {
    const response = await apiClient.get<ApiResponse<DocumentRecord[]>>('/documents', { params });
    return {
      documents: response.data.data,
      pagination: response.data.pagination!,
    };
  },

  getDocumentById: async (id: string): Promise<DocumentRecord> => {
    const response = await apiClient.get<ApiResponse<DocumentRecord>>(`/documents/${id}`);
    return response.data.data;
  },

  uploadDocument: async (formData: FormData): Promise<DocumentRecord> => {
    const response = await apiClient.post<ApiResponse<DocumentRecord>>('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  extractDocument: async (id: string): Promise<{ document: DocumentRecord; landRecord: any }> => {
    const response = await apiClient.post<ApiResponse<{ document: DocumentRecord; landRecord: any }>>(
      `/documents/${id}/extract`
    );
    return response.data.data;
  },

  verifyDocument: async (
    id: string,
    data: { action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'; remarks: string; correctedData?: any }
  ): Promise<DocumentRecord> => {
    const response = await apiClient.post<ApiResponse<DocumentRecord>>(`/documents/${id}/verify`, data);
    return response.data.data;
  },
};

