import apiClient from '../lib/axios';
import {
  CitizenApplication,
  CitizenApplicationStatus,
  CitizenDocumentType,
  CitizenLandRecord,
  CitizenNotification,
  CitizenProfile,
  DiscrepancyItem,
} from '../types/citizen';
import { LandRecord, ApiResponse } from '../types';
import { landRecordsService } from './land-records.service';
import {
  getStoredApplications,
  saveStoredApplications,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredLandRecords,
  getStoredProfile,
  saveStoredProfile,
  INITIAL_CITIZEN_PROFILE,
} from '../lib/citizenMockData';

export function mapWorkflowToCitizenApplication(w: any): CitizenApplication {
  const isApproved = w.officerDecision?.status === 'APPROVED';
  const isRejected = w.officerDecision?.status === 'REJECTED';
  const isClarification = w.officerDecision?.status === 'CLARIFICATION_REQUESTED';
  const isUnderReview = w.status === 'NEEDS_REVIEW' || w.status === 'PENDING_OFFICER_REVIEW';

  let status: CitizenApplicationStatus = 'PROCESSING';
  if (isApproved) status = 'VERIFIED';
  else if (isRejected) status = 'REJECTED';
  else if (isClarification) status = 'ACTION_REQUIRED';
  else if (isUnderReview) status = 'UNDER_REVIEW';

  const doc = w.document || {};
  const extracted = doc.extractedFields || {};
  const match = w.officialRecordMatch || {};
  const officer = w.officerDecision || {};
  const applicant = w.applicant || {};

  const survey = extracted.surveyNumber?.value || extracted.gatNumber?.value || match.matchedSurveyNumber || '—';
  const village = extracted.village?.value || match.matchedVillage || '—';
  const taluka = extracted.taluka?.value || match.matchedTaluka || '—';
  const district = extracted.district?.value || match.matchedDistrict || '—';
  const owner = extracted.ownerName?.value || applicant.name || '—';
  const area = extracted.landArea?.value || '—';
  const landType = extracted.landClassification?.value || 'Agricultural';

  const submittedDate = w.createdAt
    ? new Date(w.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Recent';

  // Discrepancy checks from field comparisons
  const discrepancies: DiscrepancyItem[] = (match.fieldComparisons || []).map((f: any) => ({
    field: f.fieldName,
    expected: f.officialValue,
    found: f.uploadedValue,
    status: f.isMatch ? 'MATCH' : 'MISMATCH',
    note: f.notes,
  }));

  const timeline = (w.auditTimeline && w.auditTimeline.length > 0)
    ? w.auditTimeline.map((t: any, index: number) => ({
        step: index + 1,
        title: t.action || 'Workflow Event',
        date: t.timestamp ? new Date(t.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : submittedDate,
        status: index === 0 ? ('COMPLETED' as const) : isApproved ? ('COMPLETED' as const) : ('CURRENT' as const),
        description: t.description || '',
      }))
    : [
        {
          step: 1,
          title: 'Document Ingestion',
          date: submittedDate,
          status: 'COMPLETED' as const,
          description: 'Document uploaded and identity checked.',
        },
        {
          step: 2,
          title: 'AI OCR & Cadastral Entity Extraction',
          date: submittedDate,
          status: 'COMPLETED' as const,
          description: 'Devanagari OCR and legal boundaries parsed.',
        },
        {
          step: 3,
          title: 'Official Cadastral Cross-Check',
          date: submittedDate,
          status: (isUnderReview || isApproved) ? ('COMPLETED' as const) : ('CURRENT' as const),
          description: match.summary || 'Validation against official revenue records.',
        },
        {
          step: 4,
          title: 'Officer Review & Sanction',
          date: officer.decidedAt ? new Date(officer.decidedAt).toLocaleDateString('en-GB') : 'Pending',
          status: isApproved ? ('COMPLETED' as const) : ('CURRENT' as const),
          description: officer.remarks || 'Competent revenue officer statutory review.',
        },
      ];

  return {
    id: w.applicationId || w.id || w._id,
    documentType: (doc.documentType as CitizenDocumentType) || '7/12 Extract',
    fileName: doc.fileName || 'uploaded_document.pdf',
    fileSize: typeof doc.fileSize === 'number' ? doc.fileSize : 1850000,
    submittedDate,
    status,
    surveyNumber: survey,
    khasraNumber: extracted.khasraNumber?.value,
    khataNumber: extracted.khataNumber?.value,
    village,
    taluka,
    district,
    landArea: area,
    landType,
    ownerName: owner,
    ocrConfidence: doc.avgConfidence || 0.95,
    extractedFields: extracted,
    identityVerified: applicant.identityStatus === 'VERIFIED',
    mobileNumber: applicant.mobile || '',
    officerName: officer.officerName || (isApproved ? 'Circle Revenue Officer' : undefined),
    officerRemarks: officer.remarks,
    verifiedByOfficer: isApproved,
    officerActionDate: officer.decidedAt
      ? new Date(officer.decidedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : undefined,
    digitalSignatureId: isApproved ? `DSC-MAHA-REV-${(w.applicationId || '2026').slice(-6).toUpperCase()}` : undefined,
    discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
    timeline,
  };
}

export function mapApiLandRecordToCitizen(r: LandRecord): CitizenLandRecord {
  const isVerified = r.verificationStatus === 'VERIFIED';
  const officerName = typeof r.verifiedBy === 'object' && r.verifiedBy !== null ? r.verifiedBy.name : (isVerified ? 'Revenue Officer' : undefined);
  const officerDesignation = typeof r.verifiedBy === 'object' && r.verifiedBy !== null ? r.verifiedBy.role : (isVerified ? 'Circle Revenue Officer' : undefined);

  return {
    id: r._id || r.recordId || `REC-${r.surveyNumber}`,
    owner: r.ownerName,
    owners: [r.ownerName],
    surveyNumber: r.surveyNumber || r.gatNumber || '',
    khataNumber: r.khataNumber || '—',
    khasraNumber: r.khasraNumber || '—',
    village: r.village || '',
    taluka: r.tehsil || '',
    district: r.district || '',
    area: r.plotArea || '—',
    landType: r.landClassification || 'Agricultural',
    tenureStatus: r.ownershipType || 'Occupant Class 1',
    mutationNumber: r.mutationNumber || '—',
    recordStatus: isVerified ? 'VERIFIED' : r.hasActiveDispute ? 'FLAGGED' : 'UNDER_REVIEW',
    status: r.verificationStatus || (isVerified ? 'VERIFIED' : 'UNDER_REVIEW'),
    verifiedDate: r.updatedAt
      ? new Date(r.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : isVerified
      ? 'Verified'
      : 'Pending Verification',
    verifiedByOfficer: isVerified,
    officerName,
    officerDesignation,
    digitalSignatureId: isVerified ? `DSC-MAHA-REV-${(r._id || r.recordId || '2026').slice(-6).toUpperCase()}` : undefined,
    ulpin: r.ulpin || undefined,
    assessment: '₹ 3.50 / year',
    encumbrance: r.hasBankCharge
      ? 'Bank Lien / Encumbered'
      : r.hasActiveDispute
      ? 'Disputed Title (RCCMS)'
      : 'No Dues / Clear Title',
    mutationHistory: r.mutationNumber
      ? [
          {
            mutationNo: r.mutationNumber,
            date: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-GB') : 'Recent',
            nature: r.ownershipType || 'Cadastral Title Deed',
            sanctionedBy: officerName || 'Circle Officer',
          },
        ]
      : [],
  };
}

export const citizenService = {
  // Auth state
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const citizenLoggedIn = localStorage.getItem('ilrdvs_citizen_logged_in') === 'true';
    if (!citizenLoggedIn) return false;

    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (u.role && u.role !== 'CITIZEN') {
          return false;
        }
      } catch {
        return false;
      }
    }
    return true;
  },

  login(userOrContact: string | Partial<CitizenProfile>, name?: string): CitizenProfile {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ilrdvs_citizen_logged_in', 'true');
    }
    const profile = getStoredProfile();
    let updated: CitizenProfile;

    if (typeof userOrContact === 'object' && userOrContact !== null) {
      updated = {
        ...profile,
        ...userOrContact,
        lastLogin: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } else {
      const isEmail = typeof userOrContact === 'string' && userOrContact.includes('@');
      updated = {
        ...profile,
        name: name || (isEmail ? profile.name : name || profile.name),
        email: isEmail ? userOrContact : profile.email,
        mobile: !isEmail && userOrContact ? userOrContact : profile.mobile,
        lastLogin: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    }
    saveStoredProfile(updated);
    return updated;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ilrdvs_citizen_logged_in');
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        try {
          const u = JSON.parse(rawUser);
          if (u.role === 'CITIZEN') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch {
          // ignore
        }
      }
    }
  },

  // Applications
  getApplications(filter?: { status?: string; search?: string }): CitizenApplication[] {
    let list = getStoredApplications();
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((a) => a.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.surveyNumber.toLowerCase().includes(q) ||
          a.village.toLowerCase().includes(q) ||
          a.documentType.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async fetchApplications(filter?: { status?: string; search?: string }): Promise<CitizenApplication[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/verifications/citizen/applications', {
        params: { limit: 50 },
      });
      const workflows = response.data?.data;
      if (Array.isArray(workflows) && workflows.length > 0) {
        const liveApps = workflows.map(mapWorkflowToCitizenApplication);
        const stored = getStoredApplications();
        
        // Merge live applications with locally stored ones (avoid duplicates by ID)
        const liveIds = new Set(liveApps.map((a) => a.id.toLowerCase()));
        const merged = [...liveApps, ...stored.filter((s) => !liveIds.has(s.id.toLowerCase()))];
        saveStoredApplications(merged);
      }
    } catch (error) {
      // If unauthenticated or offline, seamlessly fall back to local stored cache
      console.warn('Could not fetch live verification applications, using local cache:', error);
    }
    return this.getApplications(filter);
  },

  getApplicationById(id: string): CitizenApplication | undefined {
    const list = getStoredApplications();
    return list.find((a) => a.id.toLowerCase() === id.toLowerCase());
  },

  async fetchApplicationById(id: string): Promise<CitizenApplication | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/verifications/${id}`);
      if (response.data?.success && response.data?.data) {
        const liveApp = mapWorkflowToCitizenApplication(response.data.data);
        const list = getStoredApplications();
        const index = list.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
        if (index >= 0) {
          list[index] = liveApp;
        } else {
          list.unshift(liveApp);
        }
        saveStoredApplications(list);
        return liveApp;
      }
    } catch (error) {
      console.warn(`Could not fetch live application ${id}, using local cache:`, error);
    }
    return this.getApplicationById(id);
  },

  submitApplication(newAppData: Partial<CitizenApplication>): CitizenApplication {
    const list = getStoredApplications();
    const count = list.length + 125;
    const newId = `ILRDVS-2026-000${count}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newApp: CitizenApplication = {
      id: newId,
      documentType: newAppData.documentType || '7/12 Extract',
      fileName: newAppData.fileName || 'uploaded_document.pdf',
      fileSize: newAppData.fileSize || 1850000,
      submittedDate: today,
      status: 'PROCESSING',
      surveyNumber: newAppData.surveyNumber || '101/A',
      village: newAppData.village || 'Khadakwasla',
      taluka: newAppData.taluka || 'Haveli',
      district: newAppData.district || 'Pune',
      landArea: newAppData.landArea || '1.25 Hectare',
      landType: newAppData.landType || 'Agricultural',
      ownerName: newAppData.ownerName || 'Rahul Patil',
      ocrConfidence: newAppData.ocrConfidence || 0.96,
      extractedFields: newAppData.extractedFields || {},
      identityVerified: true,
      mobileNumber: newAppData.mobileNumber || '+91 98220 12345',
      timeline: [
        {
          step: 1,
          title: 'Document Uploaded',
          date: `${today}, Just now`,
          status: 'COMPLETED',
          description: 'Citizen submitted land document with Aadhaar/Mobile verified identity.',
        },
        {
          step: 2,
          title: 'AI OCR Extraction Completed',
          date: `${today}, Just now`,
          status: 'COMPLETED',
          description: 'Survey, parcel and ownership fields extracted and reviewed by citizen.',
        },
        {
          step: 3,
          title: 'Automated Cadastral Cross-Verification',
          date: 'In progress',
          status: 'CURRENT',
          description: 'Cross-verifying extracted survey parcel with GIS Mahabhunaksha geometry.',
        },
        {
          step: 4,
          title: 'Competent Authority Review',
          date: 'Pending',
          status: 'PENDING',
          description: 'Taluka Land Records Officer / Talathi review.',
        },
        {
          step: 5,
          title: 'Digitized & Stored in Repository',
          date: 'Pending',
          status: 'PENDING',
          description: 'Tamper-proof digital record generation and certificate release.',
        },
      ],
    };

    list.unshift(newApp);
    saveStoredApplications(list);

    // Add a notification
    this.addNotification({
      title: `Application Submitted: ${newId}`,
      message: `Your application for ${newApp.documentType} (Survey ${newApp.surveyNumber}) has been submitted for automated cadastral validation.`,
      type: 'INFO',
      link: `/portal/applications/${newId}`,
    });

    return newApp;
  },

  submitDigitalDocumentApplication(input: {
    documentType: any;
    surveyNumber: string;
    village: string;
    taluka?: string;
    district?: string;
    purpose?: string;
    applicantNotes?: string;
    aadharNumber?: string;
    aadharFileName?: string;
    isAadharVerified?: boolean;
    mobileNumber?: string;
  }): CitizenApplication {
    const list = getStoredApplications();
    const count = list.length + 130;
    const newId = `ILRDVS-2026-000${count}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const maskedAadhaar = input.aadharNumber
      ? input.aadharNumber.replace(/\s/g, '').replace(/(\d{4})\d{4}(\d{4})/, '$1 XXXX $2')
      : 'XXXX XXXX 1045';

    const newApp: CitizenApplication = {
      id: newId,
      documentType: input.documentType,
      fileName: `${input.documentType.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${input.surveyNumber.replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: 1450000,
      submittedDate: today,
      status: 'UNDER_REVIEW',
      surveyNumber: input.surveyNumber,
      village: input.village || 'Khadakwasla',
      taluka: input.taluka || 'Haveli',
      district: input.district || 'Pune',
      landArea: '1.85 Hectare',
      landType: 'Agricultural (Jirayat)',
      ownerName: 'Rahul Patil',
      ocrConfidence: 0.99,
      identityVerified: true,
      mobileNumber: input.mobileNumber || '+91 98220 12345',
      aadharNumber: maskedAadhaar,
      aadharFileName: input.aadharFileName || 'aadhaar_card_front_back.pdf',
      isAadharVerified: input.isAadharVerified ?? true,
      officerName: 'Shri Suresh Deshmukh',
      officerDesignation: 'Taluka Revenue Officer',
      officerOffice: 'Haveli Tehsil Office, Pune',
      verifiedByOfficer: false,
      purpose: input.purpose || 'Official Legal & Verification Record',
      officerRemarks: 'Application received for digital document issuance. Assigned to Circle Revenue Officer for statutory verification.',
      extractedFields: {
        documentType: {
          label: 'Document Requested',
          value: input.documentType,
          confidence: 0.99,
          confidenceLevel: 'High',
        },
        surveyNumber: {
          label: 'Survey / Gat No.',
          value: input.surveyNumber,
          confidence: 0.99,
          confidenceLevel: 'High',
        },
        village: {
          label: 'Village',
          value: input.village || 'Khadakwasla',
          confidence: 0.99,
          confidenceLevel: 'High',
        },
      },
      timeline: [
        {
          step: 1,
          title: 'Aadhaar e-KYC Verified & Ingested',
          date: `${today}, ${nowTime}`,
          status: 'COMPLETED',
          description: `Citizen identity verified via Aadhaar OTP (${maskedAadhaar}). Uploaded Aadhaar file: ${input.aadharFileName || 'aadhaar_document.pdf'}. Applied for ${input.documentType} on Survey ${input.surveyNumber}.`,
        },
        {
          step: 2,
          title: 'Cadastral Database Cross-Check',
          date: `${today}, ${nowTime}`,
          status: 'COMPLETED',
          description: 'Automated validation against Maharashtra Revenue Land Registry repository.',
        },
        {
          step: 3,
          title: 'Officer Inspection & Verification',
          date: 'In Progress',
          status: 'CURRENT',
          description: 'Assigned to Circle Revenue Officer (Shri Suresh Deshmukh) for statutory title cross-verification.',
        },
        {
          step: 4,
          title: 'Officer Sanction & Order',
          date: 'Pending Officer Review',
          status: 'PENDING',
          description: 'Revenue authority review and verification sanction.',
        },
        {
          step: 5,
          title: 'Digital Signature & Certificate Delivery',
          date: 'Pending Officer Signature',
          status: 'PENDING',
          description: 'Digitally signed official extract with secure QR code.',
        },
      ],
    };

    list.unshift(newApp);
    saveStoredApplications(list);

    this.addNotification({
      title: `Digital Document Applied: ${newId}`,
      message: `Your application for ${newApp.documentType} (Survey ${newApp.surveyNumber}) has been submitted to the Taluka Revenue Officer for verification.`,
      type: 'INFO',
      link: `/portal/applications/${newId}`,
    });

    return newApp;
  },

  async respondToDiscrepancy(id: string, explanation: string, docName?: string): Promise<boolean> {
    try {
      await apiClient.post(`/verifications/${id}/clarification`, {
        responseText: explanation,
      });
    } catch (error) {
      console.warn(`Could not push clarification to backend for ${id}:`, error);
    }

    const list = getStoredApplications();
    const index = list.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return false;

    const app = list[index];
    app.status = 'UNDER_REVIEW';
    app.officerRemarks = `Citizen Clarification Provided: "${explanation}". Pending re-verification by Talathi.`;
    
    // update timeline step 3/4
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    app.timeline = app.timeline.map((t) => {
      if (t.step === 3) {
        return {
          ...t,
          title: 'Citizen Response Submitted',
          date: today,
          status: 'COMPLETED' as const,
          description: `Citizen clarified: ${explanation.slice(0, 80)}... Supporting file: ${docName || 'None'}`,
        };
      }
      if (t.step === 4) {
        return {
          ...t,
          status: 'CURRENT' as const,
          description: 'Officer re-assessing discrepancy resolution.',
        };
      }
      return t;
    });

    list[index] = app;
    saveStoredApplications(list);

    this.addNotification({
      title: `Response Received for ${id}`,
      message: 'Your explanation and supporting document have been forwarded to the verification officer.',
      type: 'INFO',
      link: `/portal/applications/${id}`,
    });

    return true;
  },

  updateApplicationVerdict(
    id: string,
    action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW',
    remarks: string,
    officerName?: string
  ): boolean {
    const list = getStoredApplications();
    const index = list.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return false;

    const app = list[index];
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (action === 'APPROVED') {
      app.status = 'VERIFIED';
      app.verifiedByOfficer = true;
      app.officerName = officerName || app.officerName || 'Circle Revenue Officer';
      app.officerRemarks = remarks;
      app.timeline = app.timeline.map((t) => ({
        ...t,
        status: 'COMPLETED',
      }));
      this.addNotification({
        title: `Document Verified & Sealed: ${id}`,
        message: `Your application for ${app.documentType} (Survey ${app.surveyNumber}) has been approved and sealed under MLRC Sec 149.`,
        type: 'SUCCESS',
        link: `/portal/applications/${id}`,
      });
    } else if (action === 'REJECTED') {
      app.status = 'REJECTED';
      app.officerRemarks = remarks;
      this.addNotification({
        title: `Application Rejected: ${id}`,
        message: `Your application for ${app.documentType} was rejected. Reason: ${remarks}`,
        type: 'ALERT',
        link: `/portal/applications/${id}`,
      });
    } else {
      app.status = 'ACTION_REQUIRED';
      app.officerRemarks = remarks;
      this.addNotification({
        title: `Clarification Required: ${id}`,
        message: `The revenue verifier requested clarification: ${remarks}`,
        type: 'WARNING',
        link: `/portal/applications/${id}`,
      });
    }

    list[index] = app;
    saveStoredApplications(list);
    return true;
  },

  // Land records (live backend API)
  async getLandRecords(): Promise<CitizenLandRecord[]> {
    try {
      const res = await landRecordsService.getLandRecords({ limit: 100 });
      if (res?.records && res.records.length > 0) {
        return res.records.map(mapApiLandRecordToCitizen);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch land records from API, falling back to local stored records:', error);
      return getStoredLandRecords();
    }
  },

  // Notifications
  getNotifications(): CitizenNotification[] {
    return getStoredNotifications();
  },

  markNotificationRead(id: string): void {
    const notifs = getStoredNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStoredNotifications(updated);
  },

  markAllNotificationsRead(): void {
    const notifs = getStoredNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    saveStoredNotifications(updated);
  },

  addNotification(n: Omit<CitizenNotification, 'id' | 'date' | 'read'>): void {
    const notifs = getStoredNotifications();
    const newNotif: CitizenNotification = {
      id: `notif-${Date.now()}`,
      title: n.title,
      message: n.message,
      type: n.type,
      link: n.link,
      read: false,
      date: 'Just now',
    };
    notifs.unshift(newNotif);
    saveStoredNotifications(notifs);
  },

  // Profile
  getProfile(): CitizenProfile {
    const stored = getStoredProfile();
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          return {
            ...stored,
            name: u.name || stored.name,
            email: u.email || stored.email,
            mobile: u.mobileNumber || stored.mobile,
            district: u.district || stored.district,
            taluka: u.taluka || stored.taluka,
            village: u.village || stored.village,
            preferredLanguage: u.preferredLanguage || stored.preferredLanguage,
            isIdentityVerified: u.emailVerified ?? stored.isIdentityVerified,
          };
        } catch {
          // fallback to stored
        }
      }
    }
    return stored;
  },

  async fetchProfile(): Promise<CitizenProfile> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/auth/me');
      if (response.data?.success && response.data?.data) {
        const u = response.data.data;
        const stored = getStoredProfile();
        const updated: CitizenProfile = {
          ...stored,
          name: u.name || stored.name,
          email: u.email || stored.email,
          mobile: u.mobileNumber || stored.mobile,
          district: u.district || stored.district,
          taluka: u.taluka || stored.taluka,
          village: u.village || stored.village,
          preferredLanguage: u.preferredLanguage || stored.preferredLanguage,
          isIdentityVerified: u.emailVerified ?? stored.isIdentityVerified,
        };
        saveStoredProfile(updated);
        return updated;
      }
    } catch (error) {
      console.warn('Could not fetch live user profile, using local cache:', error);
    }
    return this.getProfile();
  },

  updateProfile(updates: Partial<CitizenProfile>): CitizenProfile {
    const profile = getStoredProfile();
    const updated = { ...profile, ...updates };
    saveStoredProfile(updated);
    return updated;
  },
};
