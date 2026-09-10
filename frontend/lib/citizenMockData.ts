import {
  CitizenApplication,
  CitizenNotification,
  CitizenLandRecord,
  CitizenProfile,
} from '../types/citizen';

export const INITIAL_CITIZEN_PROFILE: CitizenProfile = {
  name: 'Rahul Patil',
  mobile: '+91 98220 12345',
  email: 'rahul.patil@example.com',
  preferredLanguage: 'English',
  district: 'Pune',
  taluka: 'Haveli',
  village: 'Khadakwasla',
  lastLogin: '05 Sep 2026, 10:15 AM',
  isIdentityVerified: true,
};

export const INITIAL_APPLICATIONS: CitizenApplication[] = [
  {
    id: 'ILRDVS-2026-000124',
    documentType: '7/12 Extract',
    fileName: 'satbara_khadakwasla_124_2.pdf',
    fileSize: 2450000,
    submittedDate: '05 Sep 2026',
    status: 'UNDER_REVIEW',
    surveyNumber: '124/2',
    khasraNumber: 'KH-124',
    khataNumber: '450',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    landArea: '2.35 Hectare',
    landType: 'Agricultural (Jirayat)',
    ownerName: 'Rahul Patil',
    mutationNumber: 'MTR-2026-012',
    documentDate: '12 Jan 2026',
    ocrConfidence: 0.98,
    verifiedByOfficer: false,
    officerName: 'Shri Suresh Deshmukh',
    officerDesignation: 'Circle Revenue Officer (Mandal Adhikari)',
    officerOffice: 'Khadakwasla Circle Office, Haveli',
    purpose: 'Digital Land Extract & Bank Loan Verification',
    extractedFields: {
      ownerName: {
        label: 'Owner Name',
        value: 'Rahul Patil',
        confidence: 0.97,
        confidenceLevel: 'High',
      },
      surveyNumber: {
        label: 'Survey Number',
        value: '124/2',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      khataNumber: {
        label: 'Khata Number',
        value: '450',
        confidence: 0.98,
        confidenceLevel: 'High',
      },
      village: {
        label: 'Village',
        value: 'Khadakwasla',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      taluka: {
        label: 'Taluka',
        value: 'Haveli',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      district: {
        label: 'District',
        value: 'Pune',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      landArea: {
        label: 'Land Area',
        value: '2.35 Hectare',
        confidence: 0.96,
        confidenceLevel: 'High',
      },
      landType: {
        label: 'Land Classification',
        value: 'Agricultural (Jirayat)',
        confidence: 0.95,
        confidenceLevel: 'High',
      },
      mutationNumber: {
        label: 'Latest Mutation No.',
        value: 'MTR-2026-012',
        confidence: 0.94,
        confidenceLevel: 'High',
      },
      documentDate: {
        label: 'Extract Date',
        value: '12 Jan 2026',
        confidence: 0.96,
        confidenceLevel: 'High',
      },
    },
    identityVerified: true,
    mobileNumber: '+91 98220 12345',
    officerRemarks: 'Assigned to Circle Officer S. Deshmukh. Field cross-verification in progress.',
    timeline: [
      {
        step: 1,
        title: 'Application Submitted',
        date: '05 Sep 2026, 09:30 AM',
        status: 'COMPLETED',
        description: 'Document and initial application ingested into portal.',
      },
      {
        step: 2,
        title: 'AI OCR Processing',
        date: '05 Sep 2026, 09:31 AM',
        status: 'COMPLETED',
        description: 'Multilingual neural engine extracted 10 cadastral fields.',
      },
      {
        step: 3,
        title: 'Identity Verified',
        date: '05 Sep 2026, 09:32 AM',
        status: 'COMPLETED',
        description: 'Mobile OTP verification completed by Rahul Patil.',
      },
      {
        step: 4,
        title: 'Officer Review Pending',
        date: '05 Sep 2026, 10:00 AM',
        status: 'CURRENT',
        description: 'Assigned to Circle Officer (Shri S. Deshmukh) for physical validation.',
      },
      {
        step: 5,
        title: 'Final Decision',
        date: 'Estimated: 08 Sep 2026',
        status: 'PENDING',
        description: 'Digital certificate issuance upon officer sanction.',
      },
    ],
  },
  {
    id: 'ILRDVS-2026-000098',
    documentType: 'Ferfar / Mutation Record',
    fileName: 'mutation_register_wadgaon_87_3.pdf',
    fileSize: 1890000,
    submittedDate: '28 Aug 2026',
    status: 'VERIFIED',
    surveyNumber: '87/3',
    khasraNumber: 'KH-87',
    khataNumber: '210',
    village: 'Wadgaon Budruk',
    taluka: 'Haveli',
    district: 'Pune',
    landArea: '1.10 Hectare',
    landType: 'Agricultural (Bagayat)',
    ownerName: 'Rahul Patil',
    mutationNumber: 'MTR-2025-88',
    documentDate: '15 Aug 2026',
    ocrConfidence: 0.99,
    extractedFields: {
      ownerName: {
        label: 'Owner Name',
        value: 'Rahul Patil',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      surveyNumber: {
        label: 'Survey Number',
        value: '87/3',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      village: {
        label: 'Village',
        value: 'Wadgaon Budruk',
        confidence: 0.98,
        confidenceLevel: 'High',
      },
      taluka: {
        label: 'Taluka',
        value: 'Haveli',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      district: {
        label: 'District',
        value: 'Pune',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      landArea: {
        label: 'Land Area',
        value: '1.10 Hectare',
        confidence: 0.97,
        confidenceLevel: 'High',
      },
    },
    identityVerified: true,
    mobileNumber: '+91 98220 12345',
    verifiedByOfficer: true,
    officerName: 'Smt. Anjali Patil',
    officerDesignation: 'Taluka Executive Magistrate & Tehsildar',
    officerOffice: 'Haveli Revenue Division, Pune',
    officerActionDate: '02 Sep 2026',
    digitalSignatureId: 'DSC-MAHA-REV-2026-98124',
    purpose: 'Title Regularization & Digital Mutation Record',
    verificationDate: '02 Sep 2026',
    officerRemarks: 'Sanctioned and digitally signed by Tehsildar (Haveli Division). Title authenticated.',
    timeline: [
      {
        step: 1,
        title: 'Application Submitted',
        date: '28 Aug 2026, 11:20 AM',
        status: 'COMPLETED',
        description: 'Mutation application submitted.',
      },
      {
        step: 2,
        title: 'AI Processing & OCR',
        date: '28 Aug 2026, 11:21 AM',
        status: 'COMPLETED',
        description: 'Attributes extracted with 99% neural confidence.',
      },
      {
        step: 3,
        title: 'Identity Verified',
        date: '28 Aug 2026, 11:22 AM',
        status: 'COMPLETED',
        description: 'Mobile OTP verified successfully.',
      },
      {
        step: 4,
        title: 'Officer Review',
        date: '31 Aug 2026, 03:40 PM',
        status: 'COMPLETED',
        description: 'Circle Inspector verified original register entry.',
      },
      {
        step: 5,
        title: 'Sanctioned & Verified',
        date: '02 Sep 2026, 04:15 PM',
        status: 'COMPLETED',
        description: 'Official digital extract issued with QR code seal.',
      },
    ],
  },
  {
    id: 'ILRDVS-2026-000075',
    documentType: 'Sale Deed',
    fileName: 'registered_sale_deed_kothrud.pdf',
    fileSize: 3120000,
    submittedDate: '20 Aug 2026',
    status: 'ACTION_REQUIRED',
    surveyNumber: '45/1',
    khasraNumber: 'KH-45',
    khataNumber: '780',
    village: 'Kothrud',
    taluka: 'Haveli',
    district: 'Pune',
    landArea: '850 sq.m',
    landType: 'Residential Plot',
    ownerName: 'Rahul S. Patil',
    mutationNumber: 'REG-9921',
    documentDate: '10 Jul 2026',
    ocrConfidence: 0.91,
    extractedFields: {
      ownerName: {
        label: 'Owner Name',
        value: 'Rahul S. Patil',
        confidence: 0.88,
        confidenceLevel: 'Medium',
      },
      surveyNumber: {
        label: 'Survey Number',
        value: '45/1',
        confidence: 0.98,
        confidenceLevel: 'High',
      },
      village: {
        label: 'Village',
        value: 'Kothrud',
        confidence: 0.99,
        confidenceLevel: 'High',
      },
      landArea: {
        label: 'Land Area',
        value: '850 sq.m',
        confidence: 0.84,
        confidenceLevel: 'Needs Review',
      },
    },
    identityVerified: true,
    mobileNumber: '+91 98220 12345',
    verifiedByOfficer: false,
    officerName: 'Shri Mahesh Kulkarni',
    officerDesignation: 'Deputy Superintendent of Land Records (DSLR)',
    officerOffice: 'Haveli Cadastral Survey Division',
    purpose: 'Property Registration & Title Mutation',
    discrepancies: [
      {
        field: 'Survey Number',
        expected: '45/1',
        found: '45/1',
        status: 'MATCH',
        note: 'Matches city survey CTS master record.',
      },
      {
        field: 'Owner Name',
        expected: 'Suresh B. Patil (Prior Owner in Record)',
        found: 'Rahul S. Patil (Purchaser on Deed)',
        status: 'MISMATCH',
        note: 'Conveyance mutation deed reference required to complete title transfer.',
      },
      {
        field: 'Land Area',
        expected: '920 sq.m (Registered Plot Area)',
        found: '850 sq.m (Extracted Super Built)',
        status: 'MISMATCH',
        note: 'Discrepancy of 70 sq.m between sale deed schedule and registry entry.',
      },
      {
        field: 'Mutation / Registration Number',
        expected: 'REG-9921',
        found: 'REG-9921',
        status: 'MATCH',
        note: 'Sub-Registrar serial registration authenticated.',
      },
    ],
    officerRemarks:
      'Some information requires additional verification by an authorized officer. Please upload the prior mutation index or sanction deed to reconcile the 70 sq.m area variation.',
    timeline: [
      {
        step: 1,
        title: 'Application Submitted',
        date: '20 Aug 2026, 02:10 PM',
        status: 'COMPLETED',
        description: 'Sale deed submitted for title registry alignment.',
      },
      {
        step: 2,
        title: 'AI Processing',
        date: '20 Aug 2026, 02:11 PM',
        status: 'COMPLETED',
        description: 'OCR analysis completed with discrepancy flags.',
      },
      {
        step: 3,
        title: 'Identity Verified',
        date: '20 Aug 2026, 02:12 PM',
        status: 'COMPLETED',
        description: 'Citizen credentials confirmed.',
      },
      {
        step: 4,
        title: 'Discrepancy Flagged',
        date: '22 Aug 2026, 11:30 AM',
        status: 'CURRENT',
        description: 'Officer requested supporting index-II copy for area reconciliation.',
      },
      {
        step: 5,
        title: 'Final Decision',
        date: 'Pending Citizen Response',
        status: 'PENDING',
        description: 'Awaiting citizen clarification.',
      },
    ],
  },
];

export const INITIAL_LAND_RECORDS: CitizenLandRecord[] = [
  {
    id: 'REC-PUN-001',
    owner: 'Rahul Patil',
    owners: ['Rahul Patil'],
    ulpin: '27-25-045-00087-003',
    surveyNumber: '87/3',
    khataNumber: '210',
    khasraNumber: 'KH-87',
    village: 'Wadgaon Budruk',
    taluka: 'Haveli',
    district: 'Pune',
    area: '1.10 Hectare',
    landType: 'Agricultural (Bagayat)',
    tenureStatus: 'Occupant Class 1 (Bhogwatadar Class 1)',
    assessment: '₹ 3.50 / year',
    encumbrance: 'No Dues / Clear Title',
    mutationNumber: 'MTR-2025-88',
    recordStatus: 'VERIFIED',
    status: 'VERIFIED',
    verifiedDate: '02 Sep 2026',
    verifiedByOfficer: true,
    officerName: 'Smt. Anjali Patil',
    officerDesignation: 'Taluka Executive Magistrate & Tehsildar',
    digitalSignatureId: 'DSC-MAHA-REV-2026-98124',
    mutationHistory: [
      {
        mutationNo: 'MTR-2025-88',
        date: '15 Aug 2026',
        nature: 'Inheritance Succession (वारस नोंद)',
        sanctionedBy: 'Circle Officer, Haveli',
      },
      {
        mutationNo: 'MTR-2018-42',
        date: '10 Mar 2018',
        nature: 'Partition Deed (वापस वाटप)',
        sanctionedBy: 'Talathi, Wadgaon',
      },
    ],
  },
  {
    id: 'REC-PUN-002',
    owner: 'Rahul Patil',
    owners: ['Rahul Patil'],
    ulpin: '27-25-045-00124-002',
    surveyNumber: '124/2',
    khataNumber: '450',
    khasraNumber: 'KH-124',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    area: '2.35 Hectare',
    landType: 'Agricultural (Jirayat)',
    tenureStatus: 'Occupant Class 1',
    assessment: '₹ 4.25 / year',
    encumbrance: 'Under Mutation Notice',
    mutationNumber: 'MTR-2026-012',
    recordStatus: 'UNDER_REVIEW',
    status: 'UNDER_REVIEW',
    verifiedDate: 'Pending Verification',
    verifiedByOfficer: false,
    officerName: 'Shri Suresh Deshmukh',
    officerDesignation: 'Circle Revenue Officer (Mandal Adhikari)',
    mutationHistory: [
      {
        mutationNo: 'MTR-2026-012',
        date: '12 Jan 2026',
        nature: 'Purchase Conveyance (खरेदी नोंद)',
        sanctionedBy: 'Awaiting Officer Sanction',
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Document Uploaded Successfully',
    message: 'Your 7/12 Extract for Survey #124/2 (Khadakwasla) was uploaded and processed.',
    date: '05 Sep 2026, 09:31 AM',
    read: false,
    type: 'SUCCESS',
    link: '/portal/applications/ILRDVS-2026-000124',
  },
  {
    id: 'NOTIF-02',
    title: 'Under Officer Review',
    message: 'Application ILRDVS-2026-000124 has been assigned to Circle Officer Shri S. Deshmukh.',
    date: '05 Sep 2026, 10:00 AM',
    read: false,
    type: 'INFO',
    link: '/portal/applications/ILRDVS-2026-000124',
  },
  {
    id: 'NOTIF-03',
    title: 'Action Required: Discrepancy Clarification',
    message: 'Additional information is required for Application ILRDVS-2026-000075 (Kothrud).',
    date: '22 Aug 2026, 11:30 AM',
    read: false,
    type: 'WARNING',
    link: '/portal/applications/ILRDVS-2026-000075',
  },
  {
    id: 'NOTIF-04',
    title: 'Land Record Verified & Authenticated',
    message: 'Your mutation record for Survey #87/3 has been verified by the Tehsildar.',
    date: '02 Sep 2026, 04:15 PM',
    read: true,
    type: 'SUCCESS',
    link: '/portal/applications/ILRDVS-2026-000098',
  },
];

// Helper functions for persistent local storage in browser
export const getStoredApplications = (): CitizenApplication[] => {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  const stored = localStorage.getItem('ilrdvs_citizen_applications');
  if (!stored) {
    localStorage.setItem('ilrdvs_citizen_applications', JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

export const saveStoredApplications = (apps: CitizenApplication[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ilrdvs_citizen_applications', JSON.stringify(apps));
};

export const getStoredNotifications = (): CitizenNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  const stored = localStorage.getItem('ilrdvs_citizen_notifications');
  if (!stored) {
    localStorage.setItem('ilrdvs_citizen_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifs: CitizenNotification[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ilrdvs_citizen_notifications', JSON.stringify(notifs));
};

export const getStoredProfile = (): CitizenProfile => {
  if (typeof window === 'undefined') return INITIAL_CITIZEN_PROFILE;
  const stored = localStorage.getItem('ilrdvs_citizen_profile');
  if (!stored) {
    localStorage.setItem('ilrdvs_citizen_profile', JSON.stringify(INITIAL_CITIZEN_PROFILE));
    return INITIAL_CITIZEN_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CITIZEN_PROFILE;
  }
};

export const saveStoredProfile = (profile: CitizenProfile): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ilrdvs_citizen_profile', JSON.stringify(profile));
};

export const getStoredLandRecords = (): CitizenLandRecord[] => {
  if (typeof window === 'undefined') return INITIAL_LAND_RECORDS;
  const stored = localStorage.getItem('ilrdvs_citizen_land_records');
  if (!stored) {
    localStorage.setItem('ilrdvs_citizen_land_records', JSON.stringify(INITIAL_LAND_RECORDS));
    return INITIAL_LAND_RECORDS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_LAND_RECORDS;
  }
};
