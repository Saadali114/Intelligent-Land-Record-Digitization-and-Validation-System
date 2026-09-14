import apiClient from '../lib/axios';
import {
  VerificationWorkflowData,
  OfficerDecisionType,
  verificationWorkflowService,
} from './verificationWorkflowService';

export interface DocumentVerificationItem {
  _id?: string;
  applicationId: string;
  userId?: string;
  status: string;
  applicant: {
    name: string;
    mobile: string;
    email: string;
    identityStatus: string;
    identityMethod: string;
    demoNote?: string;
  };
  document: {
    documentType: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    uploadedAt: string;
    ocrEngine: string;
    avgConfidence: number;
    extractedFields: Record<string, any>;
    consistency: {
      status: string;
      summary: string;
      checks: Array<{ id: string; name: string; passed: boolean; notes: string }>;
      visualAnomaliesDetected: boolean;
      anomalyNotes?: string;
    };
  };
  officialRecordMatch: {
    status: string;
    matchedRecordId?: string;
    matchedVillage: string;
    matchedTaluka: string;
    matchedDistrict: string;
    matchedSurveyNumber: string;
    fieldComparisons: Array<{
      fieldName: string;
      uploadedValue: string;
      officialValue: string;
      isMatch: boolean;
    }>;
    summary: string;
  };
  relationshipVerification: {
    status: string;
    relationshipType: string;
    landOwnerName: string;
    applicantName: string;
    evidenceRequired: boolean;
    explanation: string;
  };
  riskAssessment: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    score: number;
    signals: {
      positive: string[];
      negative: string[];
    };
    reasons: string[];
    summary: string;
  };
  officerDecision: {
    status: string;
    officerId?: string;
    officerName?: string;
    remarks?: string;
    decidedAt?: string;
  };
  clarificationHistory?: Array<{
    requestedAt: string;
    officerMessage: string;
    respondedAt?: string;
    responseText?: string;
  }>;
  auditTimeline: Array<{
    timestamp: string;
    action: string;
    actor: string;
    actorRole: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OfficerQueueParams {
  status?: string;
  riskLevel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DemoCadastralRecord {
  recordId: string;
  ownerName: string;
  surveyNumber: string;
  gatNumber?: string;
  khasraNumber: string;
  khataNumber: string;
  plotArea: string;
  village: string;
  tehsil: string;
  district: string;
  landClassification: string;
  mutationNumber?: string;
  sourceType: string;
}

export const documentVerificationService = {
  /**
   * Upload document and run AI verification pipeline
   */
  async uploadAndVerify(
    formData: FormData
  ): Promise<DocumentVerificationItem> {
    try {
      const response = await apiClient.post<{ success: boolean; data: DocumentVerificationItem }>(
        '/verifications/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.warn('Backend API unavailable, utilizing prototype workflow engine:', err);
      const preset = formData.get('casePreset') as string;
      if (preset === 'CASE_2_YELLOW') {
        return verificationWorkflowService.getPreset('CASE_2_YELLOW') as unknown as DocumentVerificationItem;
      }
      if (preset === 'CASE_3_RED') {
        return verificationWorkflowService.getPreset('CASE_3_RED') as unknown as DocumentVerificationItem;
      }
      return verificationWorkflowService.getPreset('CASE_1_GREEN') as unknown as DocumentVerificationItem;
    }
  },

  /**
   * Retrieve verification application details by ID
   */
  async getDetail(id: string): Promise<DocumentVerificationItem> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DocumentVerificationItem }>(
        `/verifications/${id}`
      );
      return response.data.data;
    } catch (err) {
      console.warn('Backend API unavailable, reading from prototype data engine:', err);
      const wf = verificationWorkflowService.getWorkflowById(id);
      return (wf || verificationWorkflowService.getPreset('CASE_1_GREEN')) as unknown as DocumentVerificationItem;
    }
  },

  /**
   * Citizen views their submitted verifications
   */
  async getCitizenApplications(
    page = 1,
    limit = 10
  ): Promise<{ items: DocumentVerificationItem[]; total: number }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: DocumentVerificationItem[];
        pagination: { total: number };
      }>('/verifications/citizen/applications', { params: { page, limit } });
      return {
        items: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (err) {
      console.warn('Fallback citizen applications:', err);
      const all = verificationWorkflowService.getAllPresets() as unknown as DocumentVerificationItem[];
      return { items: all, total: all.length };
    }
  },

  /**
   * Officer views the verification worklist
   */
  async getOfficerQueue(
    params?: OfficerQueueParams
  ): Promise<{ items: DocumentVerificationItem[]; total: number }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: DocumentVerificationItem[];
        pagination: { total: number };
      }>('/verifications/officer/queue', { params });
      return {
        items: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (err) {
      console.warn('Fallback officer queue:', err);
      const presets = verificationWorkflowService.getAllPresets() as unknown as DocumentVerificationItem[];
      return { items: presets, total: presets.length };
    }
  },

  /**
   * Officer submits authoritative verdict: APPROVE, CLARIFICATION, REJECT
   */
  async submitDecision(
    id: string,
    payload: {
      decision: OfficerDecisionType;
      remarks?: string;
      clarificationMessage?: string;
    }
  ): Promise<DocumentVerificationItem> {
    try {
      const response = await apiClient.post<{ success: boolean; data: DocumentVerificationItem }>(
        `/verifications/${id}/officer-decision`,
        payload
      );
      return response.data.data;
    } catch (err) {
      console.warn('Fallback decision submit:', err);
      const updated = verificationWorkflowService.saveOfficerDecision(
        id,
        payload.decision,
        payload.remarks || payload.clarificationMessage || ''
      );
      return updated as unknown as DocumentVerificationItem;
    }
  },

  /**
   * Citizen responds to clarification request
   */
  async respondToClarification(
    id: string,
    responseText: string
  ): Promise<DocumentVerificationItem> {
    try {
      const response = await apiClient.post<{ success: boolean; data: DocumentVerificationItem }>(
        `/verifications/${id}/clarification`,
        { responseText }
      );
      return response.data.data;
    } catch (err) {
      console.warn('Fallback respond to clarification:', err);
      const current = (verificationWorkflowService.getWorkflowById(id) ||
        verificationWorkflowService.getPreset('CASE_1_GREEN')) as unknown as DocumentVerificationItem;
      return current;
    }
  },

  /**
   * Demo Cadastral Reference Records (Admin / Officer CRUD)
   */
  async getDemoRecords(): Promise<DemoCadastralRecord[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DemoCadastralRecord[] }>(
        '/verifications/demo-records/list'
      );
      return response.data.data || [];
    } catch (err) {
      console.warn('Failed to load demo records from API:', err);
      return [];
    }
  },

  async createDemoRecord(
    record: Partial<DemoCadastralRecord>
  ): Promise<DemoCadastralRecord> {
    const response = await apiClient.post<{ success: boolean; data: DemoCadastralRecord }>(
      '/verifications/demo-records',
      record
    );
    return response.data.data;
  },

  async updateDemoRecord(
    id: string,
    record: Partial<DemoCadastralRecord>
  ): Promise<DemoCadastralRecord> {
    const response = await apiClient.put<{ success: boolean; data: DemoCadastralRecord }>(
      `/verifications/demo-records/${id}`,
      record
    );
    return response.data.data;
  },

  async deleteDemoRecord(id: string): Promise<void> {
    await apiClient.delete(`/verifications/demo-records/${id}`);
  },
};
