export type UserRole = 'ADMIN' | 'OFFICER' | 'VERIFIER' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  district: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'NEEDS_REVIEW';

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
  uploadedAt: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface LandRecord {
  _id: string;
  ownerName: string;
  surveyNumber: string;
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
