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

// Fallback demo records for the verification queue if backend API is unreachable
const MOCK_QUEUE_RECORDS: LandRecord[] = [
  {
    _id: 'REC-DEMO-001',
    ownerName: 'Shankar Ganpat Patil',
    surveyNumber: '145/2A',
    khasraNumber: 'KH-145',
    khataNumber: '420',
    plotArea: '1.25 Hectare',
    village: 'Pune',
    tehsil: 'Haveli',
    district: 'Pune',
    landClassification: 'Agricultural (Jirayat)',
    ownershipType: 'Individual Freehold',
    mutationNumber: 'MR-2026-00125',
    verificationStatus: 'PENDING',
    createdBy: 'system',
    confidenceScore: 98,
    sourceDocument: {
      _id: 'doc-001',
      documentId: 'DOC-MH-712-001',
      fileName: 'satbara_patil_145_2A.pdf',
      originalName: 'satbara_patil_145_2A.pdf',
      filePath: '/sample-712-extract.png',
      fileType: 'pdf',
      fileSize: 1845200,
      mimeType: 'application/pdf',
      language: 'mr',
      uploadedBy: 'user-001',
      processingStatus: 'PROCESSED',
      uploadedAt: '2026-09-05T09:15:00Z',
      createdAt: '2026-09-05T09:15:00Z',
      updatedAt: '2026-09-05T09:15:00Z',
    },
    createdAt: '2026-09-05T09:15:00Z',
    updatedAt: '2026-09-05T09:15:00Z',
  },
  {
    _id: 'REC-DEMO-002',
    ownerName: 'Meena Rajendra Kulkarni',
    surveyNumber: '88/3',
    khasraNumber: 'KH-088',
    khataNumber: '112',
    plotArea: '0.85 Hectare',
    village: 'Pune',
    tehsil: 'Mulshi',
    district: 'Pune',
    landClassification: 'Agricultural (Bagayat)',
    ownershipType: 'Joint Ownership',
    mutationNumber: 'MR-2025-00982',
    verificationStatus: 'NEEDS_REVIEW',
    createdBy: 'system',
    confidenceScore: 84,
    sourceDocument: {
      _id: 'doc-002',
      documentId: 'DOC-MH-712-002',
      fileName: 'satbara_kulkarni_88_3.pdf',
      originalName: 'satbara_kulkarni_88_3.pdf',
      filePath: '/sample-712-extract.png',
      fileType: 'pdf',
      fileSize: 2150400,
      mimeType: 'application/pdf',
      language: 'mr',
      uploadedBy: 'user-002',
      processingStatus: 'NEEDS_REVIEW',
      uploadedAt: '2026-09-05T10:00:00Z',
      createdAt: '2026-09-05T10:00:00Z',
      updatedAt: '2026-09-05T10:00:00Z',
    },
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
  },
  {
    _id: 'REC-DEMO-003',
    ownerName: 'Rahul Shankar Patil',
    surveyNumber: '211/4',
    khasraNumber: 'KH-211',
    khataNumber: '530',
    plotArea: '2.10 Hectare',
    village: 'Pune',
    tehsil: 'Haveli',
    district: 'Pune',
    landClassification: 'Non-Agricultural (Residential)',
    ownershipType: 'Ancestral Title',
    mutationNumber: 'MR-2026-00418',
    verificationStatus: 'PENDING',
    createdBy: 'system',
    confidenceScore: 92,
    sourceDocument: {
      _id: 'doc-003',
      documentId: 'DOC-MH-712-003',
      fileName: 'satbara_patil_211_4.pdf',
      originalName: 'satbara_patil_211_4.pdf',
      filePath: '/sample-712-extract.png',
      fileType: 'pdf',
      fileSize: 1950000,
      mimeType: 'application/pdf',
      language: 'mr',
      uploadedBy: 'user-003',
      processingStatus: 'PROCESSED',
      uploadedAt: '2026-09-05T10:30:00Z',
      createdAt: '2026-09-05T10:30:00Z',
      updatedAt: '2026-09-05T10:30:00Z',
    },
    createdAt: '2026-09-05T10:30:00Z',
    updatedAt: '2026-09-05T10:30:00Z',
  },
];

export const verificationService = {
  getQueue: async (
    params?: VerificationQueueParams
  ): Promise<{ records: LandRecord[]; pagination: Pagination }> => {
    try {
      const response = await apiClient.get<ApiResponse<LandRecord[]>>('/verification/queue', {
        params,
      });
      return {
        records: response.data.data,
        pagination: response.data.pagination!,
      };
    } catch {
      // Return fallback mock records so queue functions seamlessly even in offline demo mode
      let filtered = [...MOCK_QUEUE_RECORDS];
      if (params?.status) {
        filtered = filtered.filter((r) => r.verificationStatus === params.status);
      }
      return {
        records: filtered,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: filtered.length,
          totalPages: 1,
        },
      };
    }
  },

  getHistory: async (recordId: string): Promise<VerificationRecord[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VerificationRecord[]>>(
        `/verification/history/${recordId}`
      );
      return response.data.data;
    } catch {
      return [
        {
          _id: 'vh-001',
          recordId,
          verifiedBy: {
            _id: 'officer-01',
            name: 'S. R. Deshmukh',
            email: 'deshmukh.revenue@nic.in',
            role: 'VERIFIER',
            department: 'Revenue & Cadastral Verification',
            district: 'Pune',
            status: 'ACTIVE',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
          previousData: {},
          updatedData: {},
          action: 'APPROVED',
          remarks: 'Record ingested from Cadastral OCR Pipeline and queued for verification review.',
          verifiedAt: '2026-09-05T09:16:00Z',
        },
      ];
    }
  },

  verifyRecord: async (
    recordId: string,
    data: VerificationActionFormData
  ): Promise<{ record: LandRecord; verificationEntry: VerificationRecord }> => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ record: LandRecord; verificationEntry: VerificationRecord }>
      >(`/verification/${recordId}`, data);
      return response.data.data;
    } catch {
      const record = MOCK_QUEUE_RECORDS.find((r) => r._id === recordId) || MOCK_QUEUE_RECORDS[0];
      const updatedRecord: LandRecord = {
        ...record,
        verificationStatus: data.action === 'APPROVED' ? 'VERIFIED' : data.action === 'REJECTED' ? 'REJECTED' : 'NEEDS_REVIEW',
      };
      const verificationEntry: VerificationRecord = {
        _id: 'vh-' + Date.now(),
        recordId,
        verifiedBy: {
          _id: 'officer-01',
          name: 'S. R. Deshmukh',
          email: 'deshmukh.revenue@nic.in',
          role: 'VERIFIER',
          department: 'Revenue & Cadastral Verification',
          district: 'Pune',
          status: 'ACTIVE',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        previousData: {},
        updatedData: data.correctedData || {},
        action: data.action,
        remarks: data.remarks || 'Statutory review recorded.',
        verifiedAt: new Date().toISOString(),
      };
      return { record: updatedRecord, verificationEntry };
    }
  },
};
