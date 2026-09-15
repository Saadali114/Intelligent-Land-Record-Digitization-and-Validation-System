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

export const INITIAL_COMPLAINTS: UserComplaint[] = [
  {
    id: 'CMP-2026-001',
    complaintNumber: 'CMP-2026-001',
    applicantName: 'Ramesh Balasaheb Patil',
    applicantEmail: 'ramesh.patil@example.com',
    applicantPhone: '+91 98220 12345',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi',
    category: 'FRAUDULENT_TRANSFER',
    severity: 'CRITICAL',
    status: 'UNDER_INVESTIGATION',
    targetDocumentId: 'DOC-MTST1AGQ-EEOP',
    targetSurveyNumber: '108/4',
    title: 'Disputed mutation entry (Ferfar #4921) without family consent',
    description: 'An unauthorized partition application was processed on Gat #108/4 where my signature was reportedly forged during transfer deed submission. Request immediate stay on registry mutation.',
    filedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    investigatingOfficer: 'Sub-Divisional Officer Haveli',
    resolutionRemarks: 'Notice issued to Sub-Registrar Haveli office. Hearing scheduled with both parties for physical verification.',
  },
  {
    id: 'CMP-2026-002',
    complaintNumber: 'CMP-2026-002',
    applicantName: 'Sunita Vijay Deshmukh',
    applicantEmail: 'sunita.deshmukh@example.com',
    applicantPhone: '+91 94231 77654',
    district: 'Satara',
    tehsil: 'Karad',
    village: 'Kole',
    category: 'BOUNDARY_DISPUTE',
    severity: 'HIGH',
    status: 'PENDING',
    targetDocumentId: 'DOC-MTST2QOF-GECZ',
    targetSurveyNumber: '241/1A',
    title: 'Survey plot area discrepancy between 7/12 extract and cadastral map',
    description: 'The digital 7/12 extract shows 1.45 Hectares whereas the village map survey indicates 1.12 Hectares. Adjoining landowner is erecting fencing beyond boundary markers.',
    filedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    investigatingOfficer: 'Taluka Inspector of Land Records (TILR) Karad',
  },
  {
    id: 'CMP-2026-003',
    complaintNumber: 'CMP-2026-003',
    applicantName: 'Anil Madhavrao Shinde',
    applicantEmail: 'anil.shinde@example.com',
    applicantPhone: '+91 98902 44321',
    district: 'Nashik',
    tehsil: 'Dindori',
    village: 'Vani',
    category: 'VERIFICATION_DELAY',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    targetDocumentId: 'DOC-MTST3KLA-AB98',
    targetSurveyNumber: '55/2',
    title: 'Verification queue delay exceeding statutory Citizen Charter deadline',
    description: 'Deed digitization submitted 14 days ago has remained in pending verification queue without officer remarks. Needed urgently for agricultural crop loan approval.',
    filedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    investigatingOfficer: 'Circle Officer Dindori',
    resolutionRemarks: 'Document verified and approved with statutory digital QR seal generated. Certificate dispatched to applicant.',
    resolvedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'CMP-2026-004',
    complaintNumber: 'CMP-2026-004',
    applicantName: 'Kavita Suresh Kulkarni',
    applicantEmail: 'kavita.k@example.com',
    applicantPhone: '+91 97654 33210',
    district: 'Kolhapur',
    tehsil: 'Panhala',
    village: 'Kodoli',
    category: 'NAME_MISMATCH',
    severity: 'LOW',
    status: 'PENDING',
    targetDocumentId: 'DOC-MTST4JKL-CD12',
    targetSurveyNumber: '89',
    title: 'Typographical error in middle name on computerized 7/12 record',
    description: 'Aadhar card states Kavita Suresh Kulkarni, but digital record has typed Kavita Ramesh Kulkarni due to OCR font misread on older Marathi Modi script document.',
    filedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    investigatingOfficer: 'Talathi Panhala Circle',
  },
  {
    id: 'CMP-2026-005',
    complaintNumber: 'CMP-2026-005',
    applicantName: 'Prakash Eknath Gaikwad',
    applicantEmail: 'prakash.gaikwad@example.com',
    applicantPhone: '+91 93701 99887',
    district: 'Nagpur',
    tehsil: 'Umred',
    village: 'Bori',
    category: 'FERFAR_ERROR',
    severity: 'HIGH',
    status: 'UNDER_INVESTIGATION',
    targetDocumentId: 'DOC-MTST5XYZ-9900',
    targetSurveyNumber: '312/3',
    title: 'Succession rights (Waras Hakka) omitted in mutation entry #182',
    description: 'Legal heir names were submitted with inheritance certificate, but only one legal heir was entered in Ferfar register while two minor daughters were omitted.',
    filedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    investigatingOfficer: 'Tahsildar Umred',
    resolutionRemarks: 'Family pedigree certificate verified. Re-mutation notice issued to all legal heirs.',
  },
];

const STORAGE_KEY = 'ilrdvs_citizen_complaints';

function getStoredComplaints(): UserComplaint[] {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMPLAINTS;
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

function saveStoredComplaints(list: UserComplaint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to persist complaints to localStorage:', e);
  }
}

export const complaintsService = {
  async getComplaints(params?: ComplaintQueryParams): Promise<UserComplaint[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.severity) query.append('severity', params.severity);
      if (params?.search) query.append('search', params.search);

      const res = await apiClient.get<any>(`/complaints?${query.toString()}`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        // Merge with local storage
        const stored = getStoredComplaints();
        const liveIds = new Set(list.map((c: UserComplaint) => c.id));
        const merged = [...list, ...stored.filter((s) => !liveIds.has(s.id))];
        saveStoredComplaints(merged);
        return list;
      }
    } catch (err) {
      console.warn('Backend complaints fetch failed, using local cache:', err);
    }

    let local = getStoredComplaints();
    if (params?.status && params.status !== 'ALL') {
      local = local.filter((c) => c.status === params.status);
    }
    if (params?.category && params.category !== 'ALL') {
      local = local.filter((c) => c.category === params.category);
    }
    if (params?.severity && params.severity !== 'ALL') {
      local = local.filter((c) => c.severity === params.severity);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      local = local.filter(
        (c) =>
          c.complaintNumber.toLowerCase().includes(q) ||
          c.applicantName.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.targetSurveyNumber && c.targetSurveyNumber.toLowerCase().includes(q))
      );
    }
    return local;
  },

  async getComplaintById(id: string): Promise<UserComplaint> {
    try {
      const res = await apiClient.get<any>(`/complaints/${id}`);
      const data = res.data?.data || res.data;
      if (data && data.id) {
        return data;
      }
    } catch (err) {
      console.warn(`Backend fetch for complaint ${id} failed, checking local store:`, err);
    }
    const local = getStoredComplaints();
    const found = local.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (found) return found;
    throw new Error('Complaint not found');
  },

  async createComplaint(data: CreateComplaintInput): Promise<UserComplaint> {
    try {
      const res = await apiClient.post<any>('/complaints', data);
      const created = res.data?.data || res.data;
      if (created && created.id) {
        const stored = getStoredComplaints();
        saveStoredComplaints([created, ...stored.filter((s) => s.id !== created.id)]);
        return created;
      }
    } catch (err) {
      console.warn('Backend complaint lodging failed, saving locally:', err);
    }

    // Local creation fallback
    const stored = getStoredComplaints();
    const nextNumber = `CMP-2026-${String(stored.length + 1).padStart(3, '0')}`;
    const newComplaint: UserComplaint = {
      id: nextNumber,
      complaintNumber: nextNumber,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail || 'citizen@service.maha.gov',
      applicantPhone: data.applicantPhone || '+91 98000 00000',
      district: data.district || 'Pune',
      tehsil: data.tehsil || 'Haveli',
      village: data.village || 'Revenue Circle',
      category: data.category || 'BOUNDARY_DISPUTE',
      severity: data.severity || 'MEDIUM',
      status: 'PENDING',
      targetDocumentId: data.targetDocumentId,
      targetSurveyNumber: data.targetSurveyNumber,
      title: data.title,
      description: data.description,
      filedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      investigatingOfficer: data.investigatingOfficer || 'Taluka Land Records Officer (TILR)',
    };

    saveStoredComplaints([newComplaint, ...stored]);
    return newComplaint;
  },

  async updateComplaintStatus(
    id: string,
    status: string,
    resolutionRemarks?: string,
    investigatingOfficer?: string
  ): Promise<UserComplaint> {
    try {
      const res = await apiClient.patch<any>(`/complaints/${id}/status`, {
        status,
        resolutionRemarks,
        investigatingOfficer,
      });
      const updated = res.data?.data || res.data;
      if (updated && updated.id) {
        const stored = getStoredComplaints();
        saveStoredComplaints(stored.map((c) => (c.id === id ? updated : c)));
        return updated;
      }
    } catch (err) {
      console.warn(`Backend update for complaint ${id} failed, updating locally:`, err);
    }

    const stored = getStoredComplaints();
    const idx = stored.findIndex((c) => c.id === id);
    if (idx >= 0) {
      const updated = {
        ...stored[idx],
        status: status as any,
        resolutionRemarks: resolutionRemarks ?? stored[idx].resolutionRemarks,
        investigatingOfficer: investigatingOfficer ?? stored[idx].investigatingOfficer,
        resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : stored[idx].resolvedAt,
        updatedAt: new Date().toISOString(),
      };
      stored[idx] = updated;
      saveStoredComplaints(stored);
      return updated;
    }
    throw new Error('Complaint not found');
  },
};
