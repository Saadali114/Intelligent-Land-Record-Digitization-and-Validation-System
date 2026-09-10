export type UserRole = 'ADMIN' | 'OFFICER' | 'VERIFIER' | 'CITIZEN';
export * from './citizen';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AccountStatus =
  | 'PENDING_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DISABLED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  district: string;
  taluka?: string;
  village?: string;
  mobileNumber?: string;
  status: UserStatus;
  accountStatus?: AccountStatus;
  preferredLanguage?: string;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfficerApplicationStatus =
  | 'PENDING_EMAIL_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED';

export interface OfficerApplication {
  _id: string;
  userId: User | string;
  requestedRole: 'OFFICER';
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  office: string;
  district: string;
  taluka?: string;
  phone?: string;
  preferredLanguage: string;
  emailVerified: boolean;
  status: OfficerApplicationStatus;
  rejectionReason?: string;
  clarificationMessage?: string;
  approvedBy?: User | { name: string; email: string };
  approvedAt?: string;
  rejectedBy?: User | { name: string; email: string };
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}


export type DocumentProcessingStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'FAILED'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'ACTION_REQUIRED'
  | 'PENDING_OFFICER_REVIEW';

export interface DocumentRecord {
  _id: string;
  documentId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  language: string;
  uploadedBy: User | string;
  processingStatus: DocumentProcessingStatus;
  uploadedAt?: string;
  checksum?: string;
  isReuploaded?: boolean;
  reuploadedFromId?: string;
  metadata?: Record<string, any>;
  fileUrl?: string;
  landRecord?: LandRecord;
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface LandRecord {
  _id: string;
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
  ownershipType: string;
  mutationNumber?: string;
  registrationNumber?: string;
  sourceDocument?: DocumentRecord | string;
  verificationStatus: VerificationStatus;
  createdBy: User | string;
  verifiedBy?: User | string;
  confidenceScore: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type VerificationAction = 'APPROVED' | 'REJECTED' | 'CORRECTED';

export interface VerificationRecord {
  _id: string;
  recordId: LandRecord | string;
  verifiedBy: User;
  previousData: Record<string, any>;
  updatedData: Record<string, any>;
  action: VerificationAction;
  remarks: string;
  verifiedAt: string;
}

export interface AuditLog {
  _id: string;
  userId?: User;
  action: string;
  resourceType: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  error?: any;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalDocuments: number;
    totalLandRecords: number;
    pendingVerification: number;
    verifiedRecords: number;
    rejectedRecords: number;
    needsReviewRecords: number;
    documentsProcessing: number;
    documentsUploaded: number;
    documentsProcessed: number;
  };
  charts: {
    verificationStatus: { status: string; count: number }[];
    documentStatus: { status: string; count: number }[];
    userRoles: { role: string; count: number }[];
    districtWise: { district: string; count: number }[];
    monthlyTrends: { period: string; count: number }[];
  };
  recentActivity: AuditLog[];
}
