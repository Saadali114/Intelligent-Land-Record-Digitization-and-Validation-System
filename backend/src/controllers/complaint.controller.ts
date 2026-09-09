import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

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

// Pre-seeded realistic cadastral disputes for demonstration & audit
let complaintsStore: UserComplaint[] = [
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
    resolutionRemarks: 'Notice issued to Sub-Registrar Haveli office. Hearing scheduled with both parties for verification of physical registry signature.',
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
  }
];

export const getComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, category, severity, search } = req.query as Record<string, string>;

    let results = [...complaintsStore];

    if (status && status !== 'ALL') {
      results = results.filter((c) => c.status === status);
    }
    if (category && category !== 'ALL') {
      results = results.filter((c) => c.category === category);
    }
    if (severity && severity !== 'ALL') {
      results = results.filter((c) => c.severity === severity);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.complaintNumber.toLowerCase().includes(q) ||
          c.applicantName.toLowerCase().includes(q) ||
          c.applicantEmail.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.targetSurveyNumber && c.targetSurveyNumber.toLowerCase().includes(q)) ||
          (c.targetDocumentId && c.targetDocumentId.toLowerCase().includes(q))
      );
    }

    sendSuccess(res, 'Complaints retrieved successfully', results, 200, {
      page: 1,
      limit: results.length,
      total: results.length,
      totalPages: 1,
    });
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch complaints', 500);
  }
};

export const getComplaintById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const complaint = complaintsStore.find((c) => c.id === req.params.id);
    if (!complaint) {
      sendError(res, 'Complaint not found', 404);
      return;
    }
    sendSuccess(res, 'Complaint retrieved successfully', complaint);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve complaint', 500);
  }
};

export const createComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const body = req.body;
    if (!body.applicantName || !body.title || !body.description) {
      sendError(res, 'Applicant name, title, and description are required', 400);
      return;
    }

    const nextNumber = `CMP-2026-${String(complaintsStore.length + 1).padStart(3, '0')}`;
    const newComplaint: UserComplaint = {
      id: nextNumber,
      complaintNumber: nextNumber,
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail || req.user?.email || 'citizen@service.maha.gov',
      applicantPhone: body.applicantPhone || '+91 98000 00000',
      district: body.district || 'Maharashtra',
      tehsil: body.tehsil || 'Central',
      village: body.village || 'Revenue Circle',
      category: body.category || 'OTHER',
      severity: body.severity || 'MEDIUM',
      status: 'PENDING',
      targetDocumentId: body.targetDocumentId,
      targetSurveyNumber: body.targetSurveyNumber,
      title: body.title,
      description: body.description,
      filedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      investigatingOfficer: body.investigatingOfficer || 'Assigned Duty Officer',
    };

    complaintsStore.unshift(newComplaint);
    sendSuccess(res, 'Complaint lodged successfully', newComplaint, 201);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to lodge complaint', 500);
  }
};

export const updateComplaintStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, resolutionRemarks, investigatingOfficer } = req.body;

    const complaintIndex = complaintsStore.findIndex((c) => c.id === id);
    if (complaintIndex === -1) {
      sendError(res, 'Complaint not found', 404);
      return;
    }

    const complaint = complaintsStore[complaintIndex];
    if (status) complaint.status = status;
    if (resolutionRemarks !== undefined) complaint.resolutionRemarks = resolutionRemarks;
    if (investigatingOfficer) complaint.investigatingOfficer = investigatingOfficer;
    if (status === 'RESOLVED') complaint.resolvedAt = new Date().toISOString();
    complaint.updatedAt = new Date().toISOString();

    complaintsStore[complaintIndex] = complaint;
    sendSuccess(res, 'Complaint status updated successfully', complaint);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update complaint status', 500);
  }
};
