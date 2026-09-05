// Verification Workflow Service & Prototype Data Engine

export type IdentityStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type ConsistencyStatus = 'PASSED' | 'WARNING' | 'FAILED';
export type OfficialMatchStatus = 'STRONG_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'NOT_FOUND';
export type RelationshipType = 'OWNER' | 'CO_OWNER' | 'LEGAL_HEIR' | 'AUTHORIZED_REPRESENTATIVE' | 'TENANT' | 'NOT_ESTABLISHED';
export type RelationshipStatus = 'MATCHED' | 'EVIDENCE_REQUIRED' | 'NOT_ESTABLISHED' | 'DISPUTED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type OfficerDecisionType = 'APPROVED' | 'CLARIFICATION_REQUESTED' | 'REJECTED';

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ConsistencyCheck {
  id: string;
  name: string;
  passed: boolean;
  notes: string;
}

export interface FieldComparison {
  fieldName: string;
  uploadedValue: string;
  officialValue: string;
  isMatch: boolean;
  notes?: string;
}

export interface TimelineEntry {
  stage: string;
  timestamp: string;
  actor: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  message: string;
  metadata?: Record<string, any>;
}

export interface VerificationWorkflowData {
  id: string;
  trackingNumber: string;
  presetId?: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED';
  title?: string;
  currentStep: number;
  overallStatus: 'IN_PROGRESS' | 'COMPLETED' | 'FLAGGED';
  applicant: {
    name: string;
    mobile: string;
    email: string;
    identityStatus: IdentityStatus;
    identityMethod: string;
    demoNote: string;
  };
  document: {
    documentType: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    ocrEngine: string;
    avgConfidence: number;
    extractedFields: Record<string, ExtractedField>;
    consistency: {
      status: ConsistencyStatus;
      summary: string;
      checks: ConsistencyCheck[];
      visualAnomaliesDetected: boolean;
    };
  };
  officialRecordMatch: {
    status: OfficialMatchStatus;
    matchedRecordId: string;
    matchedVillage: string;
    matchedTaluka: string;
    matchedDistrict: string;
    matchedSurveyNumber: string;
    fieldComparisons: FieldComparison[];
    summary: string;
  };
  relationshipVerification: {
    status: RelationshipStatus;
    relationshipType: RelationshipType;
    landOwnerName: string;
    applicantName: string;
    evidenceRequired: boolean;
    explanation: string;
  };
  riskAssessment: {
    level: RiskLevel;
    score: number;
    signals: {
      positive: string[];
      negative: string[];
    };
    reasons: string[];
    summary: string;
  };
  officerDecision?: {
    decision: OfficerDecisionType;
    officerName: string;
    officerDesignation: string;
    decidedAt: string;
    remarks: string;
  };
  auditTimeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export const PRESET_CASES: Record<string, VerificationWorkflowData> = {
  CASE_1_GREEN: {
    id: 'CASE-001-GREEN',
    trackingNumber: 'ILR-2026-VRF-001',
    presetId: 'CASE_1_GREEN',
    title: 'Case 1 — Genuine Owner (Low Risk / Approved)',
    currentStep: 6,
    overallStatus: 'COMPLETED',
    applicant: {
      name: 'Shankar Ganpat Patil',
      mobile: '+91 98220 14521',
      email: 'shankar.patil@example.com',
      identityStatus: 'VERIFIED',
      identityMethod: 'OTP_REGISTERED_MOBILE',
      demoNote: 'Demo Identity Verified via Registered Mobile OTP',
    },
    document: {
      documentType: '7/12 Extract (Satbara)',
      fileName: 'satbara_patil_145_2A.pdf',
      fileSize: '1.8 MB',
      fileUrl: '/sample-712-extract.png',
      ocrEngine: 'Cadastral Devanagari OCR v5.3 + Vision AI',
      avgConfidence: 0.98,
      extractedFields: {
        ownerName: { label: 'Owner Name', value: 'Shankar Ganpat Patil', confidence: 0.98, status: 'HIGH' },
        surveyNumber: { label: 'Survey Number', value: '145/2A', confidence: 0.99, status: 'HIGH' },
        village: { label: 'Village', value: 'Pune', confidence: 0.97, status: 'HIGH' },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.99, status: 'HIGH' },
        district: { label: 'District', value: 'Pune', confidence: 0.99, status: 'HIGH' },
        plotArea: { label: 'Land Area', value: '1.25 Hectare', confidence: 0.96, status: 'HIGH' },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-00125', confidence: 0.95, status: 'HIGH' },
      },
      consistency: {
        status: 'PASSED',
        summary: 'No significant document-level discrepancy detected.',
        checks: [
          { id: 'c1', name: 'Document type identified', passed: true, notes: 'Standard Maharashtra Form 7/12 layout identified' },
          { id: 'c2', name: 'Required fields detected', passed: true, notes: 'Owner, Survey, Taluka, Area present' },
          { id: 'c3', name: 'Survey number format valid', passed: true, notes: 'Matches division standard (145/2A)' },
          { id: 'c4', name: 'Village/Taluka relationship consistent', passed: true, notes: 'Haveli Taluka verified within Pune district' },
          { id: 'c5', name: 'OCR confidence acceptable', passed: true, notes: 'Overall confidence is 98%' },
          { id: 'c6', name: 'No significant visual anomaly detected', passed: true, notes: 'Watermark, seals, and typography unaltered' },
        ],
        visualAnomaliesDetected: false,
      },
    },
    officialRecordMatch: {
      status: 'STRONG_MATCH',
      matchedRecordId: 'REC-MH-PUN-001',
      matchedVillage: 'Pune',
      matchedTaluka: 'Haveli',
      matchedDistrict: 'Pune',
      matchedSurveyNumber: '145/2A',
      fieldComparisons: [
        { fieldName: 'Owner Name', uploadedValue: 'Shankar Ganpat Patil', officialValue: 'Shankar Ganpat Patil', isMatch: true },
        { fieldName: 'Survey No.', uploadedValue: '145/2A', officialValue: '145/2A', isMatch: true },
        { fieldName: 'Village', uploadedValue: 'Pune', officialValue: 'Pune', isMatch: true },
        { fieldName: 'Taluka', uploadedValue: 'Haveli', officialValue: 'Haveli', isMatch: true },
        { fieldName: 'Area', uploadedValue: '1.25 Hectare', officialValue: '1.25 Hectare', isMatch: true },
      ],
      summary: 'Official record match: Strong',
    },
    relationshipVerification: {
      status: 'MATCHED',
      relationshipType: 'OWNER',
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Shankar Ganpat Patil',
      evidenceRequired: false,
      explanation: 'Applicant identity matches primary Khatedar name recorded in cadastral registry.',
    },
    riskAssessment: {
      level: 'LOW',
      score: 12,
      signals: {
        positive: [
          'Identity verified via registered mobile OTP',
          'Document OCR confidence high (98%)',
          'Official cadastral land record strongly matched',
          'User-land relationship directly confirmed as Registered Owner',
          'Document consistency checks passed without anomalies',
        ],
        negative: [],
      },
      reasons: [
        'All 4 verification pillars (Identity, Document, Record Match, Relationship) are fully consistent.',
      ],
      summary: 'All major verification signals are consistent. Suitable for expedited officer sanction.',
    },
    auditTimeline: [
      { stage: 'APPLICATION_INITIATED', timestamp: '2026-09-05T09:15:00Z', actor: 'Citizen Portal', status: 'INFO', message: 'Verification application initialized by applicant.' },
      { stage: 'IDENTITY_VERIFIED', timestamp: '2026-09-05T09:15:30Z', actor: 'Identity Subsystem', status: 'SUCCESS', message: 'Mobile OTP successfully authenticated for Shankar Ganpat Patil.' },
      { stage: 'DOCUMENT_PROCESSED', timestamp: '2026-09-05T09:16:10Z', actor: 'Vision OCR Engine', status: 'SUCCESS', message: 'Satbara Extract OCR extraction completed with 98% confidence.' },
      { stage: 'CONSISTENCY_EVALUATED', timestamp: '2026-09-05T09:16:20Z', actor: 'Integrity Analyzer', status: 'SUCCESS', message: 'Document consistency checks completed with zero discrepancies.' },
      { stage: 'OFFICIAL_REGISTRY_MATCHED', timestamp: '2026-09-05T09:16:35Z', actor: 'Cadastral Connector', status: 'SUCCESS', message: '100% field match with official cadastral record REC-MH-PUN-001.' },
      { stage: 'RELATIONSHIP_VERIFIED', timestamp: '2026-09-05T09:16:45Z', actor: 'Legal Standing Engine', status: 'SUCCESS', message: 'Applicant confirmed as title holder.' },
      { stage: 'RISK_SCORED', timestamp: '2026-09-05T09:16:50Z', actor: 'Risk Engine', status: 'SUCCESS', message: 'Assigned Low Risk rating (Score: 12/100).' },
    ],
    createdAt: '2026-09-05T09:15:00Z',
    updatedAt: '2026-09-05T09:16:50Z',
  },

  CASE_2_YELLOW: {
    id: 'CASE-002-YELLOW',
    trackingNumber: 'ILR-2026-VRF-002',
    presetId: 'CASE_2_YELLOW',
    title: 'Case 2 — Stolen / Third-Party Document (Medium Risk / Action Required)',
    currentStep: 6,
    overallStatus: 'FLAGGED',
    applicant: {
      name: 'Rahul Patil',
      mobile: '+91 97654 32109',
      email: 'rahul.patil@example.com',
      identityStatus: 'VERIFIED',
      identityMethod: 'OTP_REGISTERED_MOBILE',
      demoNote: 'Demo Identity Verified (Applicant is Rahul Patil, NOT Shankar Ganpat Patil)',
    },
    document: {
      documentType: '7/12 Extract (Satbara)',
      fileName: 'genuine_satbara_patil_145_2A.pdf',
      fileSize: '2.1 MB',
      fileUrl: '/sample-712-extract.png',
      ocrEngine: 'Cadastral Devanagari OCR v5.3 + Vision AI',
      avgConfidence: 0.97,
      extractedFields: {
        ownerName: { label: 'Owner Name', value: 'Shankar Ganpat Patil', confidence: 0.98, status: 'HIGH' },
        surveyNumber: { label: 'Survey Number', value: '145/2A', confidence: 0.99, status: 'HIGH' },
        village: { label: 'Village', value: 'Pune', confidence: 0.97, status: 'HIGH' },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.99, status: 'HIGH' },
        district: { label: 'District', value: 'Pune', confidence: 0.99, status: 'HIGH' },
        plotArea: { label: 'Land Area', value: '1.25 Hectare', confidence: 0.96, status: 'HIGH' },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-00125', confidence: 0.95, status: 'HIGH' },
      },
      consistency: {
        status: 'PASSED',
        summary: 'No significant document-level discrepancy detected.',
        checks: [
          { id: 'c1', name: 'Document type identified', passed: true, notes: 'Genuine Form 7/12 extract' },
          { id: 'c2', name: 'Required fields detected', passed: true, notes: 'All standard columns verified' },
          { id: 'c3', name: 'Survey number format valid', passed: true, notes: 'Survey 145/2A verified' },
          { id: 'c4', name: 'Village/Taluka relationship consistent', passed: true, notes: 'Haveli, Pune valid' },
          { id: 'c5', name: 'OCR confidence acceptable', passed: true, notes: '97% confidence' },
          { id: 'c6', name: 'No significant visual anomaly detected', passed: true, notes: 'Document paper texture & seals genuine' },
        ],
        visualAnomaliesDetected: false,
      },
    },
    officialRecordMatch: {
      status: 'STRONG_MATCH',
      matchedRecordId: 'REC-MH-PUN-001',
      matchedVillage: 'Pune',
      matchedTaluka: 'Haveli',
      matchedDistrict: 'Pune',
      matchedSurveyNumber: '145/2A',
      fieldComparisons: [
        { fieldName: 'Owner Name', uploadedValue: 'Shankar Ganpat Patil', officialValue: 'Shankar Ganpat Patil', isMatch: true },
        { fieldName: 'Survey No.', uploadedValue: '145/2A', officialValue: '145/2A', isMatch: true },
        { fieldName: 'Village', uploadedValue: 'Pune', officialValue: 'Pune', isMatch: true },
        { fieldName: 'Taluka', uploadedValue: 'Haveli', officialValue: 'Haveli', isMatch: true },
        { fieldName: 'Area', uploadedValue: '1.25 Hectare', officialValue: '1.25 Hectare', isMatch: true },
      ],
      summary: 'Official record match: Strong',
    },
    relationshipVerification: {
      status: 'NOT_ESTABLISHED',
      relationshipType: 'NOT_ESTABLISHED',
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Rahul Patil',
      evidenceRequired: true,
      explanation:
        'Applicant name (Rahul Patil) differs from registered owner (Shankar Ganpat Patil). No registered Power of Attorney or legal heirship certificate found.',
    },
    riskAssessment: {
      level: 'MEDIUM',
      score: 58,
      signals: {
        positive: [
          'Identity verified via registered mobile OTP',
          'Document consistent & OCR confidence high',
          'Official cadastral land record strongly matched',
        ],
        negative: [
          'User-land relationship not established (applicant is not registered owner)',
          'Potential third-party / unauthorized document submission',
        ],
      },
      reasons: [
        'User-land relationship not established: Applicant (Rahul Patil) is uploading document belonging to Shankar Ganpat Patil.',
        'Official land record matched and document is textually consistent, but authorization to transact on this parcel is unverified.',
      ],
      summary:
        'Document appears consistent, but the applicant’s relationship with the land record could not be established. Action Required.',
    },
    auditTimeline: [
      { stage: 'APPLICATION_INITIATED', timestamp: '2026-09-05T10:00:00Z', actor: 'Citizen Portal', status: 'INFO', message: 'Application initiated by Rahul Patil.' },
      { stage: 'IDENTITY_VERIFIED', timestamp: '2026-09-05T10:00:30Z', actor: 'Identity Subsystem', status: 'SUCCESS', message: 'Identity authenticated via OTP (+91 97654 32109).' },
      { stage: 'DOCUMENT_PROCESSED', timestamp: '2026-09-05T10:01:10Z', actor: 'Vision OCR Engine', status: 'SUCCESS', message: 'Document extracted successfully (97% confidence).' },
      { stage: 'CONSISTENCY_EVALUATED', timestamp: '2026-09-05T10:01:25Z', actor: 'Integrity Analyzer', status: 'SUCCESS', message: 'No significant document-level discrepancy detected.' },
      { stage: 'OFFICIAL_REGISTRY_MATCHED', timestamp: '2026-09-05T10:01:40Z', actor: 'Cadastral Connector', status: 'SUCCESS', message: 'Official record found and matched (REC-MH-PUN-001).' },
      { stage: 'RELATIONSHIP_VERIFIED', timestamp: '2026-09-05T10:01:50Z', actor: 'Legal Standing Engine', status: 'ALERT', message: 'FLAG: Applicant (Rahul Patil) is NOT registered owner (Shankar Ganpat Patil).' },
      { stage: 'RISK_SCORED', timestamp: '2026-09-05T10:02:00Z', actor: 'Risk Engine', status: 'WARNING', message: 'Medium Risk flagged: User-Land Relationship Not Established (Score: 58/100).' },
    ],
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:02:00Z',
  },

  CASE_3_RED: {
    id: 'CASE-003-RED',
    trackingNumber: 'ILR-2026-VRF-003',
    presetId: 'CASE_3_RED',
    title: 'Case 3 — Cadastral Discrepancy & Tampered Area (High Risk / Officer Review)',
    currentStep: 6,
    overallStatus: 'FLAGGED',
    applicant: {
      name: 'Rahul Patil',
      mobile: '+91 97654 32109',
      email: 'rahul.patil@example.com',
      identityStatus: 'VERIFIED',
      identityMethod: 'OTP_REGISTERED_MOBILE',
      demoNote: 'Demo Identity Verified',
    },
    document: {
      documentType: '7/12 Extract (Satbara)',
      fileName: 'altered_satbara_haveli_145_9X.pdf',
      fileSize: '3.4 MB',
      fileUrl: '/sample-712-extract.png',
      ocrEngine: 'Cadastral Devanagari OCR v5.3 + Vision AI',
      avgConfidence: 0.74,
      extractedFields: {
        ownerName: { label: 'Owner Name', value: 'Kashinath Dnyandev Shinde', confidence: 0.79, status: 'MEDIUM' },
        surveyNumber: { label: 'Survey Number', value: '145/9X', confidence: 0.71, status: 'LOW' },
        village: { label: 'Village', value: 'Pune', confidence: 0.88, status: 'HIGH' },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.91, status: 'HIGH' },
        district: { label: 'District', value: 'Pune', confidence: 0.95, status: 'HIGH' },
        plotArea: { label: 'Land Area', value: '2.50 Hectare', confidence: 0.65, status: 'LOW' },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-99999', confidence: 0.68, status: 'LOW' },
      },
      consistency: {
        status: 'WARNING',
        summary: 'Visual density anomalies and low OCR confidence detected.',
        checks: [
          { id: 'c1', name: 'Document type identified', passed: true, notes: 'Form 7/12 template detected' },
          { id: 'c2', name: 'Required fields detected', passed: true, notes: 'Fields present but font kerning irregular' },
          { id: 'c3', name: 'Survey number format valid', passed: false, notes: 'Suffix 9X not conforming to cadastral ledger' },
          { id: 'c4', name: 'Village/Taluka relationship consistent', passed: true, notes: 'Haveli Taluka geographic envelope matches' },
          { id: 'c5', name: 'OCR confidence acceptable', passed: false, notes: 'Confidence in Area column below threshold (65%)' },
          { id: 'c6', name: 'No significant visual anomaly detected', passed: false, notes: 'Compression noise and text pixel mismatch detected around area numeral' },
        ],
        visualAnomaliesDetected: true,
      },
    },
    officialRecordMatch: {
      status: 'MISMATCH',
      matchedRecordId: 'REC-MH-PUN-001',
      matchedVillage: 'Pune',
      matchedTaluka: 'Haveli',
      matchedDistrict: 'Pune',
      matchedSurveyNumber: '145/2A',
      fieldComparisons: [
        { fieldName: 'Owner Name', uploadedValue: 'Kashinath Dnyandev Shinde', officialValue: 'Shankar Ganpat Patil', isMatch: false, notes: 'Owner name does not exist on Survey 145' },
        { fieldName: 'Survey No.', uploadedValue: '145/9X', officialValue: '145/2A', isMatch: false, notes: 'Subdivision 9X not recorded in official cadastre' },
        { fieldName: 'Village', uploadedValue: 'Pune', officialValue: 'Pune', isMatch: true },
        { fieldName: 'Taluka', uploadedValue: 'Haveli', officialValue: 'Haveli', isMatch: true },
        { fieldName: 'Area', uploadedValue: '2.50 Hectare', officialValue: '1.25 Hectare', isMatch: false, notes: 'Extracted area exceeds official parcel by 1.25 Ha' },
      ],
      summary: 'Official record match: Discrepancy Detected',
    },
    relationshipVerification: {
      status: 'NOT_ESTABLISHED',
      relationshipType: 'NOT_ESTABLISHED',
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Rahul Patil',
      evidenceRequired: true,
      explanation: 'Applicant is not listed in title history for Survey 145.',
    },
    riskAssessment: {
      level: 'HIGH',
      score: 89,
      signals: {
        positive: ['Identity verified via registered mobile OTP'],
        negative: [
          'Document area inflated (Uploaded: 2.50 Ha vs Official: 1.25 Ha)',
          'Extracted owner does not match official cadastral registry',
          'Survey subdivision 9X does not exist in authorized registry',
          'Document visual density anomalies detected around area figures',
          'User-land relationship not established',
        ],
      },
      reasons: [
        'Cadastral discrepancy: Extracted area 2.50 Hectare contradicts official cadastral area 1.25 Hectare.',
        'Owner mismatch: Document claims Kashinath Shinde, but cadastral database records Shankar Ganpat Patil.',
        'Document consistency check flagged visual density alteration in numerical cells.',
      ],
      summary: 'Critical discrepancies found in area, survey subdivision, and ownership. High risk of fraudulent alteration.',
    },
    auditTimeline: [
      { stage: 'APPLICATION_INITIATED', timestamp: '2026-09-05T11:30:00Z', actor: 'Citizen Portal', status: 'INFO', message: 'Application initiated.' },
      { stage: 'IDENTITY_VERIFIED', timestamp: '2026-09-05T11:30:20Z', actor: 'Identity Subsystem', status: 'SUCCESS', message: 'OTP verified.' },
      { stage: 'DOCUMENT_PROCESSED', timestamp: '2026-09-05T11:31:00Z', actor: 'Vision OCR Engine', status: 'WARNING', message: 'OCR extraction flagged low confidence on area numerical cell (65%).' },
      { stage: 'CONSISTENCY_EVALUATED', timestamp: '2026-09-05T11:31:15Z', actor: 'Integrity Analyzer', status: 'ALERT', message: 'Visual density anomaly detected: Possible text overlay on area field.' },
      { stage: 'OFFICIAL_REGISTRY_MATCHED', timestamp: '2026-09-05T11:31:30Z', actor: 'Cadastral Connector', status: 'ALERT', message: 'MAJOR MISMATCH: Cadastral registry records 1.25 Ha, uploaded doc states 2.50 Ha.' },
      { stage: 'RELATIONSHIP_VERIFIED', timestamp: '2026-09-05T11:31:40Z', actor: 'Legal Standing Engine', status: 'ALERT', message: 'Applicant relationship not established.' },
      { stage: 'RISK_SCORED', timestamp: '2026-09-05T11:31:50Z', actor: 'Risk Engine', status: 'ALERT', message: 'Assigned HIGH RISK rating (Score: 89/100). Manual officer review mandated.' },
    ],
    createdAt: '2026-09-05T11:30:00Z',
    updatedAt: '2026-09-05T11:31:50Z',
  },
};

// Client-side cache for interactive prototype updates (decisions, sessions)
const localCache = new Map<string, VerificationWorkflowData>();

export const verificationWorkflowService = {
  getPreset: (presetKey: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED'): VerificationWorkflowData => {
    return JSON.parse(JSON.stringify(PRESET_CASES[presetKey]));
  },

  getAllPresets: (): VerificationWorkflowData[] => {
    return Object.values(PRESET_CASES).map((p) => JSON.parse(JSON.stringify(p)));
  },

  getWorkflowById: (id: string): VerificationWorkflowData | null => {
    if (localCache.has(id)) {
      return JSON.parse(JSON.stringify(localCache.get(id)!));
    }
    const foundPreset = Object.values(PRESET_CASES).find((p) => p.id === id || p.presetId === id);
    if (foundPreset) {
      return JSON.parse(JSON.stringify(foundPreset));
    }
    // Default fallback to Case 1
    return JSON.parse(JSON.stringify(PRESET_CASES.CASE_1_GREEN));
  },

  saveOfficerDecision: (
    workflowId: string,
    decision: OfficerDecisionType,
    remarks: string,
    officerName: string = 'S. R. Deshmukh',
    officerDesignation: string = 'Revenue Inspector / Sub-Divisional Officer'
  ): VerificationWorkflowData => {
    const current = verificationWorkflowService.getWorkflowById(workflowId) || PRESET_CASES.CASE_1_GREEN;
    const updated: VerificationWorkflowData = {
      ...current,
      officerDecision: {
        decision,
        officerName,
        officerDesignation,
        decidedAt: new Date().toISOString(),
        remarks: remarks || 'Action processed under statutory authority.',
      },
      auditTimeline: [
        ...current.auditTimeline,
        {
          stage: 'OFFICER_DECISION_RECORDED',
          timestamp: new Date().toISOString(),
          actor: `${officerName} (${officerDesignation})`,
          status: decision === 'APPROVED' ? 'SUCCESS' : decision === 'REJECTED' ? 'ALERT' : 'WARNING',
          message: `Official verdict: ${decision}. Remarks: ${remarks}`,
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    localCache.set(workflowId, updated);
    return updated;
  },
};
