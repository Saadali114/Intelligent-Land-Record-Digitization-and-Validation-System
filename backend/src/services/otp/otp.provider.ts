/**
 * OTP Provider Abstraction Interface & Implementations
 * Supports MSG91 SendOTP API (Production) and Sandbox Provider (Local Dev)
 */

export interface OTPProviderResponse {
  success: boolean;
  message: string;
  requestId?: string;
  expiresIn?: number;
}

export interface OTPVerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
}

export interface OTPProvider {
  readonly name: string;
  sendOTP(phoneNumber: string, expiryMinutes: number): Promise<OTPProviderResponse>;
  verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerificationResponse>;
  resendOTP(phoneNumber: string): Promise<OTPProviderResponse>;
}

/**
 * MSG91 SendOTP Provider
 * Official REST API v5 integration
 * Documentation: https://docs.msg91.com/otp
 */
export class MSG91OTPProvider implements OTPProvider {
  readonly name = 'MSG91';
  private authKey: string;
  private templateId: string;
  private baseUrl = 'https://control.msg91.com/api/v5/otp';

  constructor(authKey?: string, templateId?: string) {
    this.authKey = authKey || process.env.MSG91_AUTH_KEY || '';
    this.templateId = templateId || process.env.MSG91_OTP_TEMPLATE_ID || '';
  }

  private cleanNumberForMSG91(phoneNumber: string): string {
    // MSG91 expects country code without '+' (e.g. 919876543210)
    let cleaned = phoneNumber.replace(/[\s\-\+]/g, '');
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = `91${cleaned}`;
    }
    return cleaned;
  }

  async sendOTP(phoneNumber: string, expiryMinutes: number = 5): Promise<OTPProviderResponse> {
    if (!this.authKey || !this.templateId) {
      throw new Error(
        'MSG91 configuration incomplete: MSG91_AUTH_KEY and MSG91_OTP_TEMPLATE_ID must be set.'
      );
    }

    const mobile = this.cleanNumberForMSG91(phoneNumber);
    const url = new URL(this.baseUrl);
    url.searchParams.append('template_id', this.templateId);
    url.searchParams.append('mobile', mobile);
    url.searchParams.append('otp_expiry', expiryMinutes.toString());
    url.searchParams.append('otp_length', '6');

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          authkey: this.authKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = (await response.json()) as any;

      if (!response.ok || data.type === 'error') {
        const errorMsg = data.message || `MSG91 gateway responded with HTTP ${response.status}`;
        console.error('[MSG91 Send Error]', { status: response.status, message: errorMsg });
        return {
          success: false,
          message: 'Unable to send OTP at this time. Please try again.',
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully to your mobile number via SMS.',
        requestId: data.request_id || undefined,
        expiresIn: expiryMinutes * 60,
      };
    } catch (err: any) {
      console.error('[MSG91 Network Error]', err.message);
      return {
        success: false,
        message: 'SMS service temporarily unavailable. Please try again later.',
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerificationResponse> {
    if (!this.authKey) {
      throw new Error('MSG91 configuration incomplete: MSG91_AUTH_KEY must be set.');
    }

    const mobile = this.cleanNumberForMSG91(phoneNumber);
    const url = new URL(`${this.baseUrl}/verify`);
    url.searchParams.append('otp', otp);
    url.searchParams.append('mobile', mobile);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          authkey: this.authKey,
          Accept: 'application/json',
        },
      });

      const data = (await response.json()) as any;

      if (response.ok && (data.type === 'success' || data.message?.toLowerCase().includes('verified') || data.message?.toLowerCase().includes('success'))) {
        return {
          success: true,
          verified: true,
          message: 'Mobile number verified successfully.',
        };
      }

      return {
        success: false,
        verified: false,
        message: data.message || 'Invalid or expired OTP. Please verify and try again.',
      };
    } catch (err: any) {
      console.error('[MSG91 Verify Error]', err.message);
      return {
        success: false,
        verified: false,
        message: 'Unable to verify OTP at this time. Please try again.',
      };
    }
  }

  async resendOTP(phoneNumber: string): Promise<OTPProviderResponse> {
    if (!this.authKey) {
      throw new Error('MSG91 configuration incomplete: MSG91_AUTH_KEY must be set.');
    }

    const mobile = this.cleanNumberForMSG91(phoneNumber);
    const url = new URL(`${this.baseUrl}/retry`);
    url.searchParams.append('authkey', this.authKey);
    url.searchParams.append('mobile', mobile);
    url.searchParams.append('retrytype', 'text');

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          authkey: this.authKey,
          Accept: 'application/json',
        },
      });

      const data = (await response.json()) as any;

      if (!response.ok || data.type === 'error') {
        return {
          success: false,
          message: data.message || 'Unable to resend OTP. Please try again later.',
        };
      }

      return {
        success: true,
        message: 'A new OTP has been sent to your mobile phone.',
      };
    } catch (err: any) {
      console.error('[MSG91 Retry Error]', err.message);
      return {
        success: false,
        message: 'SMS service temporarily unavailable. Please try again later.',
      };
    }
  }
}

/**
 * Sandbox OTP Provider
 * Strictly isolated for local development when SMS_PROVIDER_MODE=sandbox and NODE_ENV !== 'production'.
 * Never active in production.
 */
export class SandboxOTPProvider implements OTPProvider {
  readonly name = 'SANDBOX';
  private devStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: SandboxOTPProvider cannot be instantiated in production mode.');
    }
  }

  async sendOTP(phoneNumber: string, expiryMinutes: number = 5): Promise<OTPProviderResponse> {
    // Generate secure random 6-digit code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
    this.devStore.set(phoneNumber, { otp: generated, expiresAt });

    // Safe diagnostic log only in dev/sandbox mode
    console.log(`\x1b[33m[SANDBOX SMS]\x1b[0m Simulated SMS sent to ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-4)} (Dev Code: ${generated}, Expires in ${expiryMinutes}m)`);

    return {
      success: true,
      message: 'OTP sent successfully to your mobile number via SMS.',
      requestId: `sbx-${Date.now()}`,
      expiresIn: expiryMinutes * 60,
    };
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerificationResponse> {
    const entry = this.devStore.get(phoneNumber);
    if (!entry) {
      return {
        success: false,
        verified: false,
        message: 'No active OTP found for this mobile number. Please request a new code.',
      };
    }

    if (Date.now() > entry.expiresAt) {
      this.devStore.delete(phoneNumber);
      return {
        success: false,
        verified: false,
        message: 'OTP has expired. Please request a new verification code.',
      };
    }

    if (entry.otp !== otp.trim()) {
      return {
        success: false,
        verified: false,
        message: 'Invalid OTP. Please check the code and try again.',
      };
    }

    // Clear after successful verification
    this.devStore.delete(phoneNumber);
    return {
      success: true,
      verified: true,
      message: 'Mobile number verified successfully.',
    };
  }

  async resendOTP(phoneNumber: string): Promise<OTPProviderResponse> {
    return this.sendOTP(phoneNumber, 5);
  }
}

/**
 * Factory function to instantiate configured provider
 */
export function getOTPProvider(): OTPProvider {
  const isProduction = process.env.NODE_ENV === 'production';
  const providerMode = (process.env.SMS_PROVIDER_MODE || (isProduction ? 'production' : 'sandbox')).toLowerCase();
  const providerType = (process.env.SMS_PROVIDER || 'msg91').toLowerCase();

  if (isProduction || providerMode === 'production') {
    if (providerType === 'msg91') {
      return new MSG91OTPProvider();
    }
    throw new Error(`Unsupported production SMS provider: ${providerType}`);
  }

  // Local development fallback
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_OTP_TEMPLATE_ID) {
    return new MSG91OTPProvider();
  }

  return new SandboxOTPProvider();
}
