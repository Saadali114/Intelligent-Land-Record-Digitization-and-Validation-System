import {
  CitizenApplication,
  CitizenLandRecord,
  CitizenNotification,
  CitizenProfile,
} from '../types/citizen';
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

  getApplicationById(id: string): CitizenApplication | undefined {
    const list = getStoredApplications();
    return list.find((a) => a.id.toLowerCase() === id.toLowerCase());
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

  respondToDiscrepancy(id: string, explanation: string, docName?: string): boolean {
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

  // Land records
  getLandRecords(): CitizenLandRecord[] {
    return getStoredLandRecords();
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

  updateProfile(updates: Partial<CitizenProfile>): CitizenProfile {
    const profile = getStoredProfile();
    const updated = { ...profile, ...updates };
    saveStoredProfile(updated);
    return updated;
  },
};
