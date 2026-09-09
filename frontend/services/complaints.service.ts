import apiClient from '../lib/axios';

export interface UserComplaint {
  id: string;
  complaintNumber: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  district: string;
  tehsil: string;
  village: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DISMISSED';
  targetDocumentId?: string;
  targetSurveyNumber?: string;
  title: string;
  description: string;
  filedAt: string;
  updatedAt: string;
  investigatingOfficer?: string;
  resolutionRemarks?: string;
  resolvedAt?: string;
}

export interface CreateComplaintInput {
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  district: string;
  tehsil?: string;
  village?: string;
  category: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetDocumentId?: string;
  targetSurveyNumber?: string;
  title: string;
  description: string;
  investigatingOfficer?: string;
}

export interface ComplaintQueryParams {
  status?: string;
  category?: string;
  severity?: string;
  search?: string;
}

export const complaintsService = {
  async getComplaints(params?: ComplaintQueryParams): Promise<UserComplaint[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.severity) query.append('severity', params.severity);
      if (params?.search) query.append('search', params.search);

      const res = await apiClient.get<UserComplaint[]>(`/complaints?${query.toString()}`);
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return (res.data as any)?.data || [];
    } catch (err) {
      console.warn('Backend complaints fetch failed, using fallback:', err);
      return [];
    }
  },

  async getComplaintById(id: string): Promise<UserComplaint> {
    const res = await apiClient.get<UserComplaint>(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(data: CreateComplaintInput): Promise<UserComplaint> {
    const res = await apiClient.post<UserComplaint>('/complaints', data);
    return res.data;
  },

  async updateComplaintStatus(
    id: string,
    status: string,
    resolutionRemarks?: string,
    investigatingOfficer?: string
  ): Promise<UserComplaint> {
    const res = await apiClient.patch<UserComplaint>(`/complaints/${id}/status`, {
      status,
      resolutionRemarks,
      investigatingOfficer,
    });
    return res.data;
  },
};
