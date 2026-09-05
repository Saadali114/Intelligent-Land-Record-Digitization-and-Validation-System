import {
  VerificationWorkflow,
  IVerificationWorkflowDocument,
  OfficerDecisionType,
} from '../models/VerificationWorkflow.js';

// Official Cadastral Registry (Prototype Demo Records)
export const OFFICIAL_CADASTRAL_REGISTRY = [
  {
    recordId: 'REC-MH-PUN-001',
    ownerName: 'Shankar Ganpat Patil',
    surveyNumber: '145/2A',
    khasraNumber: 'KH-145',
    khataNumber: '420',
    village: 'Pune',
    taluka: 'Haveli',
    district: 'Pune',
    plotArea: '1.25 Hectare',
    landClassification: 'Agricultural (Jirayat)',
    mutationNumber: 'MR-2026-00125',
    encumbranceStatus: 'Clear Title / No Active Charge',
  },
  {
    recordId: 'REC-MH-PUN-002',
    ownerName: 'Meena Rajendra Kulkarni',
    surveyNumber: '88/3',
    khasraNumber: 'KH-088',
    khataNumber: '112',
    village: 'Pune',
    taluka: 'Mulshi',
    district: 'Pune',
    plotArea: '0.85 Hectare',
    landClassification: 'Agricultural (Bagayat)',
    mutationNumber: 'MR-2025-00982',
    encumbranceStatus: 'Bank Mortgage (State Bank of India)',
  },
  {
    recordId: 'REC-MH-PUN-003',
    ownerName: 'Rahul Shankar Patil',
    surveyNumber: '211/4',
    khasraNumber: 'KH-211',
    khataNumber: '530',
    village: 'Pune',
    taluka: 'Haveli',
    district: 'Pune',
    plotArea: '2.10 Hectare',
    landClassification: 'Non-Agricultural (Residential)',
    mutationNumber: 'MR-2026-00418',
    encumbranceStatus: 'Clear Title / Inherited Partition',
  },
];

export const DEMO_PRESET_CASES = {
  CASE_1_GREEN: {
    presetId: 'CASE_1_GREEN',
    title: 'Case 1 — Genuine Owner (Low Risk / Approved)',
    applicant: {
      name: 'Shankar Ganpat Patil',
      mobile: '+91 98220 14521',
      email: 'shankar.patil@example.com',
      identityStatus: 'VERIFIED' as const,
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
        ownerName: { label: 'Owner Name', value: 'Shankar Ganpat Patil', confidence: 0.98, status: 'HIGH' as const },
        surveyNumber: { label: 'Survey Number', value: '145/2A', confidence: 0.99, status: 'HIGH' as const },
        village: { label: 'Village', value: 'Pune', confidence: 0.97, status: 'HIGH' as const },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.99, status: 'HIGH' as const },
        district: { label: 'District', value: 'Pune', confidence: 0.99, status: 'HIGH' as const },
        plotArea: { label: 'Land Area', value: '1.25 Hectare', confidence: 0.96, status: 'HIGH' as const },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-00125', confidence: 0.95, status: 'HIGH' as const },
      },
      consistency: {
        status: 'PASSED' as const,
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
      status: 'STRONG_MATCH' as const,
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
      status: 'MATCHED' as const,
      relationshipType: 'OWNER' as const,
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Shankar Ganpat Patil',
      evidenceRequired: false,
      explanation: 'Applicant identity matches primary Khatedar name recorded in cadastral registry.',
    },
    riskAssessment: {
      level: 'LOW' as const,
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
  },

  CASE_2_YELLOW: {
    presetId: 'CASE_2_YELLOW',
    title: 'Case 2 — Stolen / Third-Party Document (Medium Risk / Action Required)',
    applicant: {
      name: 'Rahul Patil',
      mobile: '+91 97654 32109',
      email: 'rahul.patil@example.com',
      identityStatus: 'VERIFIED' as const,
      identityMethod: 'OTP_REGISTERED_MOBILE',
      demoNote: 'Demo Identity Verified (Applicant is Rahul Patil, NOT Shankar Patil)',
    },
    document: {
      documentType: '7/12 Extract (Satbara)',
      fileName: 'genuine_satbara_patil_145_2A.pdf',
      fileSize: '2.1 MB',
      fileUrl: '/sample-712-extract.png',
      ocrEngine: 'Cadastral Devanagari OCR v5.3 + Vision AI',
      avgConfidence: 0.97,
      extractedFields: {
        ownerName: { label: 'Owner Name', value: 'Shankar Ganpat Patil', confidence: 0.98, status: 'HIGH' as const },
        surveyNumber: { label: 'Survey Number', value: '145/2A', confidence: 0.99, status: 'HIGH' as const },
        village: { label: 'Village', value: 'Pune', confidence: 0.97, status: 'HIGH' as const },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.99, status: 'HIGH' as const },
        district: { label: 'District', value: 'Pune', confidence: 0.99, status: 'HIGH' as const },
        plotArea: { label: 'Land Area', value: '1.25 Hectare', confidence: 0.96, status: 'HIGH' as const },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-00125', confidence: 0.95, status: 'HIGH' as const },
      },
      consistency: {
        status: 'PASSED' as const,
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
      status: 'STRONG_MATCH' as const,
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
      status: 'NOT_ESTABLISHED' as const,
      relationshipType: 'NOT_ESTABLISHED' as const,
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Rahul Patil',
      evidenceRequired: true,
      explanation:
        'Applicant name (Rahul Patil) differs from registered owner (Shankar Ganpat Patil). No registered Power of Attorney or legal heirship certificate found.',
    },
    riskAssessment: {
      level: 'MEDIUM' as const,
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
  },

  CASE_3_RED: {
    presetId: 'CASE_3_RED',
    title: 'Case 3 — Cadastral Discrepancy & Tampered Area (High Risk / Officer Review)',
    applicant: {
      name: 'Rahul Patil',
      mobile: '+91 97654 32109',
      email: 'rahul.patil@example.com',
      identityStatus: 'VERIFIED' as const,
      identityMethod: 'OTP_REGISTERED_MOBILE',
      demoNote: 'Demo Identity Verified',
    },
    document: {
      documentType: '7/12 Extract (Satbara)',
      fileName: 'altered_extract_211_4.pdf',
      fileSize: '3.4 MB',
      fileUrl: '/sample-712-extract.png',
      ocrEngine: 'Cadastral Devanagari OCR v5.3 + Vision AI',
      avgConfidence: 0.76,
      extractedFields: {
        ownerName: { label: 'Owner Name', value: 'Shankar Ganpat Patil', confidence: 0.82, status: 'MEDIUM' as const },
        surveyNumber: { label: 'Survey Number', value: '145/9X', confidence: 0.71, status: 'LOW' as const },
        village: { label: 'Village', value: 'Pune', confidence: 0.88, status: 'MEDIUM' as const },
        taluka: { label: 'Taluka', value: 'Haveli', confidence: 0.90, status: 'HIGH' as const },
        district: { label: 'District', value: 'Pune', confidence: 0.92, status: 'HIGH' as const },
        plotArea: { label: 'Land Area', value: '2.50 Hectare', confidence: 0.68, status: 'LOW' as const },
        mutationNumber: { label: 'Mutation Number', value: 'MR-2026-99999', confidence: 0.74, status: 'LOW' as const },
      },
      consistency: {
        status: 'WARNING' as const,
        summary: 'Possible font inconsistency and pixel misalignment around land area field.',
        checks: [
          { id: 'c1', name: 'Document type identified', passed: true, notes: 'Form 7/12 layout recognized' },
          { id: 'c2', name: 'Required fields detected', passed: true, notes: 'Mandatory columns present' },
          { id: 'c3', name: 'Survey number format valid', passed: false, notes: 'Survey 145/9X has abnormal suffix format' },
          { id: 'c4', name: 'Village/Taluka relationship consistent', passed: true, notes: 'Haveli, Pune valid' },
          { id: 'c5', name: 'OCR confidence acceptable', passed: false, notes: 'Area and Survey numbers have low confidence (68-71%)' },
          { id: 'c6', name: 'No significant visual anomaly detected', passed: false, notes: 'Digital noise detected in numeric area box' },
        ],
        visualAnomaliesDetected: true,
        anomalyNotes: 'Visual density variation detected in the Area (2.50 Ha) text block.',
      },
    },
    officialRecordMatch: {
      status: 'MISMATCH' as const,
      matchedRecordId: 'REC-MH-PUN-001',
      matchedVillage: 'Pune',
      matchedTaluka: 'Haveli',
      matchedDistrict: 'Pune',
      matchedSurveyNumber: '145/2A',
      fieldComparisons: [
        { fieldName: 'Owner Name', uploadedValue: 'Shankar Ganpat Patil', officialValue: 'Shankar Ganpat Patil', isMatch: true },
        { fieldName: 'Survey No.', uploadedValue: '145/9X', officialValue: '145/2A', isMatch: false },
        { fieldName: 'Village', uploadedValue: 'Pune', officialValue: 'Pune', isMatch: true },
        { fieldName: 'Taluka', uploadedValue: 'Haveli', officialValue: 'Haveli', isMatch: true },
        { fieldName: 'Area', uploadedValue: '2.50 Hectare', officialValue: '1.25 Hectare', isMatch: false },
      ],
      summary: 'Official record match: Mismatch in Plot Area (2.50 Ha vs 1.25 Ha) & Survey Number',
    },
    relationshipVerification: {
      status: 'NOT_ESTABLISHED' as const,
      relationshipType: 'NOT_ESTABLISHED' as const,
      landOwnerName: 'Shankar Ganpat Patil',
      applicantName: 'Rahul Patil',
      evidenceRequired: true,
      explanation: 'Applicant is Rahul Patil. Recorded owner is Shankar Ganpat Patil. No heirship/POA on record.',
    },
    riskAssessment: {
      level: 'HIGH' as const,
      score: 88,
      signals: {
        positive: ['Identity verified via registered mobile OTP'],
        negative: [
          'Land area mismatch: Document specifies 2.50 Ha vs Official Registry 1.25 Ha',
          'Survey number mismatch: Document specifies 145/9X vs Official Registry 145/2A',
          'User-land relationship not established',
          'Visual anomalies detected in area field',
        ],
      },
      reasons: [
        'Area mismatch: Document specifies 2.50 Hectare while official cadastral registry lists 1.25 Hectare.',
        'Survey number discrepancy: 145/9X does not match official parcel 145/2A.',
        'User-land relationship not established.',
        'Low OCR confidence and possible digital alteration detected around numeric attributes.',
      ],
      summary: 'Multiple major verification discrepancies detected. Requires in-person scrutiny by Talathi/Tahsildar.',
    },
  },
};

export async function createVerificationSession(params: {
  preset?: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED';
  applicantName?: string;
  applicantMobile?: string;
  documentType?: string;
  fileName?: string;
}) {
  const presetKey = params.preset || 'CASE_1_GREEN';
  const presetData = DEMO_PRESET_CASES[presetKey] || DEMO_PRESET_CASES.CASE_1_GREEN;

  const appNumber = Math.floor(100000 + Math.random() * 900000);
  const applicationId = `VER-2026-${appNumber}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const session = new VerificationWorkflow({
    applicationId,
    casePreset: presetKey,
    applicant: {
      ...presetData.applicant,
      name: params.applicantName || presetData.applicant.name,
      mobile: params.applicantMobile || presetData.applicant.mobile,
      verifiedAt: now,
    },
    document: {
      ...presetData.document,
      documentType: params.documentType || presetData.document.documentType,
      fileName: params.fileName || presetData.document.fileName,
      uploadedAt: now,
    },
    officialRecordMatch: presetData.officialRecordMatch,
    relationshipVerification: presetData.relationshipVerification,
    riskAssessment: presetData.riskAssessment,
    officerDecision: {
      status: 'PENDING',
    },
    auditTimeline: [
      {
        timestamp: timeStr,
        action: 'APPLICATION_INITIATED',
        actor: params.applicantName || presetData.applicant.name,
        actorRole: 'CITIZEN',
        description: `Citizen initiated verification workflow for ${params.documentType || presetData.document.documentType}.`,
      },
      {
        timestamp: timeStr,
        action: 'IDENTITY_VERIFIED',
        actor: 'Auth Gateway',
        actorRole: 'SYSTEM',
        description: `Identity verified via registered mobile OTP (+91 XXXXX X${presetData.applicant.mobile.slice(-4)}).`,
      },
      {
        timestamp: timeStr,
        action: 'DOCUMENT_INGESTED',
        actor: 'OCR Ingestion Pipeline',
        actorRole: 'SYSTEM',
        description: `Document ${params.fileName || presetData.document.fileName} ingested. Optical character recognition completed.`,
      },
      {
        timestamp: timeStr,
        action: 'CADASTRAL_CROSSCHECK_COMPLETED',
        actor: 'Cadastral Rules Engine',
        actorRole: 'SYSTEM',
        description: `Official registry cross-check completed. Match Status: ${presetData.officialRecordMatch.status}.`,
      },
      {
        timestamp: timeStr,
        action: 'RELATIONSHIP_EVALUATED',
        actor: 'Governance Validator',
        actorRole: 'SYSTEM',
        description: `User-Land relationship evaluated: ${presetData.relationshipVerification.relationshipType} (${presetData.relationshipVerification.status}).`,
      },
    ],
  });

  await session.save();
  return session;
}

export async function getVerificationSession(applicationId: string) {
  const session = await VerificationWorkflow.findOne({ applicationId });
  if (!session) {
    // If not found in DB (e.g. fresh DB), return fallback preset
    if (applicationId.includes('CASE_2') || applicationId.includes('YELLOW')) {
      return { applicationId, ...DEMO_PRESET_CASES.CASE_2_YELLOW };
    }
    if (applicationId.includes('CASE_3') || applicationId.includes('RED')) {
      return { applicationId, ...DEMO_PRESET_CASES.CASE_3_RED };
    }
    return { applicationId, ...DEMO_PRESET_CASES.CASE_1_GREEN };
  }
  return session;
}

export async function submitOfficerDecision(
  applicationId: string,
  params: {
    decision: OfficerDecisionType;
    officerId: string;
    officerName: string;
    remarks: string;
  }
) {
  const session = await VerificationWorkflow.findOne({ applicationId });
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (!session) {
    throw new Error('Verification session not found');
  }

  session.officerDecision = {
    status: params.decision,
    officerId: params.officerId,
    officerName: params.officerName,
    remarks: params.remarks,
    decidedAt: new Date(),
  };

  session.auditTimeline.push({
    timestamp: timeStr,
    action: `OFFICER_${params.decision}`,
    actor: params.officerName,
    actorRole: 'VERIFICATION_OFFICER',
    description: `Official verdict recorded: ${params.decision}. Officer Remarks: "${params.remarks}".`,
  });

  await session.save();
  return session;
}
