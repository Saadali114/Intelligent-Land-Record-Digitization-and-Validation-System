import emailjs from '@emailjs/browser';

export interface CitizenEmailParams {
  to_name: string;
  to_email: string;
  phone?: string;
  registration_date?: string;
  portal_url?: string;
  otp?: string;
}

export interface OfficerEmailParams {
  to_name: string;
  to_email: string;
  employee_id: string;
  department: string;
  designation: string;
  office: string;
  district: string;
  taluka?: string;
  registration_date?: string;
  dashboard_url?: string;
  otp?: string;
}

export interface SendEmailResponse {
  success: boolean;
  status: number;
  text: string;
}

class EmailJSService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
  }

  /**
   * Check if EmailJS credentials are configured in the environment
   */
  public isConfigured(): boolean {
    return Boolean(this.serviceId && this.templateId && this.publicKey);
  }

  /**
   * Send a welcome and registration confirmation email to a newly registered Citizen
   */
  public async sendCitizenWelcomeEmail(params: CitizenEmailParams): Promise<SendEmailResponse> {
    const formattedDate = params.registration_date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const portalUrl = params.portal_url || (typeof window !== 'undefined' ? `${window.location.origin}/portal` : 'http://localhost:3000/portal');

    const templateParams: Record<string, unknown> = {
      to_name: params.to_name,
      to_email: params.to_email,
      email: params.to_email,
      user_email: params.to_email,
      recipient: params.to_email,
      recipient_email: params.to_email,
      to: params.to_email,
      reply_to: params.to_email,
      phone: params.phone || 'N/A',
      role: 'Citizen User',
      registration_date: formattedDate,
      portal_url: portalUrl,
      otp: params.otp || '',
      code: params.otp || '',
      otp_code: params.otp || '',
      passcode: params.otp || '',
      verification_code: params.otp || '',
      pin: params.otp || '',
      subject: params.otp
        ? `Your ILRDVS Verification Code: ${params.otp}`
        : 'Welcome to ILRDVS — Land Record Governance Citizen Portal',
      message: params.otp
        ? `Your ILRDVS verification code is: ${params.otp}. This code expires in 5 minutes. Do not share this code with anyone.`
        : `Dear ${params.to_name},\n\nWelcome to the Intelligent Land Record Digitization and Validation System (ILRDVS). Your citizen account has been registered successfully.\n\nYou can access your land documents, 7/12 extracts, property cards, and track validation applications at:\n${portalUrl}\n\nSecurity Notice: Keep your credentials secure. Revenue officials will never ask for your password or verification OTP.`,
    };

    return this.dispatchEmail(templateParams, params.to_email, 'Citizen Registration');
  }

  /**
   * Send an official onboarding and registration confirmation email to a newly registered Officer
   */
  public async sendOfficerWelcomeEmail(params: OfficerEmailParams): Promise<SendEmailResponse> {
    const formattedDate = params.registration_date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const dashboardUrl = params.dashboard_url || (typeof window !== 'undefined' ? `${window.location.origin}/verification` : 'http://localhost:3000/verification');

    const templateParams: Record<string, unknown> = {
      to_name: params.to_name,
      to_email: params.to_email,
      email: params.to_email,
      user_email: params.to_email,
      recipient: params.to_email,
      recipient_email: params.to_email,
      to: params.to_email,
      reply_to: params.to_email,
      employee_id: params.employee_id,
      department: params.department,
      designation: params.designation,
      office: params.office,
      district: params.district,
      taluka: params.taluka || 'All Talukas',
      role: 'Revenue Officer / Verifier',
      registration_date: formattedDate,
      dashboard_url: dashboardUrl,
      otp: params.otp || '',
      code: params.otp || '',
      otp_code: params.otp || '',
      passcode: params.otp || '',
      verification_code: params.otp || '',
      pin: params.otp || '',
      subject: params.otp
        ? `Your ILRDVS Verification Code: ${params.otp}`
        : 'ILRDVS Officer Registration & Onboarding Confirmation',
      message: params.otp
        ? `Your ILRDVS official verification code is: ${params.otp}. This code expires in 5 minutes. Do not share this code with anyone.`
        : `Dear Officer ${params.to_name},\n\nYour officer registration for ILRDVS has been received and processed.\n\nOfficer Details:\n- Employee ID: ${params.employee_id}\n- Designation: ${params.designation}\n- Department: ${params.department}\n- Office: ${params.office}\n- District: ${params.district}\n\nYou can access your statutory verification workstation and revenue operations dashboard at:\n${dashboardUrl}\n\nSecurity Notice: Official land records require statutory non-repudiation. Log in only through authorized government networks.`,
    };

    return this.dispatchEmail(templateParams, params.to_email, 'Officer Registration');
  }

  /**
   * Core dispatch handler using @emailjs/browser with graceful fallback
   */
  private async dispatchEmail(
    templateParams: Record<string, unknown>,
    recipientEmail: string,
    context: string
  ): Promise<SendEmailResponse> {
    // If real EmailJS keys are provided, dispatch via EmailJS
    if (this.isConfigured()) {
      try {
        const response = await emailjs.send(
          this.serviceId,
          this.templateId,
          templateParams,
          this.publicKey
        );

        console.log(`[EmailJS] Successfully sent ${context} email to ${recipientEmail}:`, response);
        return {
          success: true,
          status: response.status,
          text: response.text,
        };
      } catch (error: any) {
        console.error(`[EmailJS] Error sending ${context} email to ${recipientEmail}:`, error);
        return {
          success: false,
          status: error?.status || 500,
          text: error?.text || error?.message || 'Email delivery failed',
        };
      }
    }

    // When keys are not yet configured in .env.local, simulate real dispatch with full log
    console.info(
      `%c[EmailJS Service]%c Notice: EmailJS credentials (NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) are not configured in frontend/.env.local.\nSimulating email dispatch to: ${recipientEmail}`,
      'color: #10b981; font-weight: bold;',
      'color: #64748b;'
    );
    console.info(`[EmailJS Simulated Dispatch] ${context} Payload:`, templateParams);

    return {
      success: true,
      status: 200,
      text: 'Simulated dispatch successful (configure NEXT_PUBLIC_EMAILJS_* keys in .env.local for live inbox delivery)',
    };
  }
}

export const emailjsService = new EmailJSService();
