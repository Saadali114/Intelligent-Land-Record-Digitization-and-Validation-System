export type CitizenApplicationStatus =
  | 'PROCESSING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ACTION_REQUIRED'
  | 'REJECTED';

export type CitizenDocumentType =
  | '7/12 Extract'
  | 'Ferfar / Mutation Record'
  | 'Sale Deed'
  | 'Other Land Document'
  | 'Digital 7/12 Extract'
  | 'Digital 8A Khate-Utara'
  | 'Digital Property Card'
  | 'Title Clearance Certificate'
  | 'e-Ferfar Mutation Certificate';

export type CitizenDigitalDocType =
  | 'Digital 7/12 Extract'
  | 'Digital 8A Khate-Utara'
  | 'Digital Property Card'
  | 'Title Clearance Certificate'
  | 'e-Ferfar Mutation Certificate';

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Needs Review';
}

export interface DiscrepancyItem {
  field: string;
  expected?: string;
  found: string;
  status: 'MATCH' | 'MISMATCH';
  note?: string;
}

export interface TimelineEvent {
  step: number;
  title: string;
  date: string;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING';
  description: string;
}

export interface CitizenApplication {
  id: string; // e.g. ILRDVS-2026-000124
  documentType: CitizenDocumentType;
  fileName: string;
  fileSize: number;
  submittedDate: string;
  status: CitizenApplicationStatus;
  surveyNumber: string;
  khasraNumber?: string;
  khataNumber?: string;
  village: string;
  taluka: string;
  district: string;
  landArea: string;
  landType: string;
  ownerName: string;
  mutationNumber?: string;
  documentDate?: string;
  ocrConfidence: number;
  extractedFields: Record<string, ExtractedField>;
  identityVerified: boolean;
  mobileNumber: string;
  aadharNumber?: string;
  aadharFileName?: string;
  isAadharVerified?: boolean;
  discrepancies?: DiscrepancyItem[];
  officerName?: string;
  officerDesignation?: string;
  officerOffice?: string;
  verifiedByOfficer?: boolean;
  officerActionDate?: string;
  digitalSignatureId?: string;
  purpose?: string;
  officerRemarks?: string;
  verificationDate?: string;
  clarificationSubmitted?: string;
  timeline: TimelineEvent[];
}

export interface CitizenNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ALERT';
  link?: string;
}

export interface CitizenLandRecord {
  id: string;
  owner: string;
  owners?: string[];
  surveyNumber: string;
  khataNumber: string;
  khasraNumber: string;
  village: string;
  taluka: string;
  district: string;
  area: string;
  landType: string;
  tenureStatus: string;
  mutationNumber: string;
  recordStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'FLAGGED';
  status?: string;
  verifiedDate: string;
  verifiedByOfficer?: boolean;
  officerName?: string;
  officerDesignation?: string;
  digitalSignatureId?: string;
  ulpin?: string;
  assessment?: string;
  encumbrance?: string;
  mutationHistory: Array<{
    mutationNo: string;
    date: string;
    nature?: string;
    type?: string;
    sanctionedBy?: string;
    details?: string;
  }>;
}

export interface CitizenProfile {
  name: string;
  mobile: string;
  email: string;
  preferredLanguage: string;
  district: string;
  taluka: string;
  village: string;
  lastLogin: string;
  isIdentityVerified: boolean;
}
