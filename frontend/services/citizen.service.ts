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
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('ilrdvs_citizen_logged_in') === 'true';
  },

  login(mobile: string, name = 'Rahul Patil'): CitizenProfile {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ilrdvs_citizen_logged_in', 'true');
    }
    const profile = getStoredProfile();
    const updated = {
      ...profile,
      name: name || profile.name,
      mobile: mobile || profile.mobile,
      lastLogin: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    saveStoredProfile(updated);
    return updated;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ilrdvs_citizen_logged_in');
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
    return getStoredProfile();
  },

  updateProfile(updates: Partial<CitizenProfile>): CitizenProfile {
    const profile = getStoredProfile();
    const updated = { ...profile, ...updates };
    saveStoredProfile(updated);
    return updated;
  },
};
