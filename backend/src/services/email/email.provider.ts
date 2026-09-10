/**
 * 
 * Email Provider Abstraction & Implementations
 * Supports EmailJS REST API v1.0 and DevEmailProvider (Local Sandbox)
 */

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  otp?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  readonly name: string;
  sendEmail(input: SendEmailInput): Promise<SendEmailResult>;
}

/**
 * EmailJS Email Provider
 * Official REST API v1.0 integration (no external npm dependencies required)
 * Documentation: https://www.emailjs.com/docs/rest-api/send/
 */
export class EmailJSEmailProvider implements EmailProvider {
  readonly name = 'EMAILJS';
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private privateKey?: string;

  constructor(serviceId?: string, templateId?: string, publicKey?: string, privateKey?: string) {
    this.serviceId = serviceId || process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    this.templateId = templateId || process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = publicKey || process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
    this.privateKey = privateKey || process.env.EMAILJS_PRIVATE_KEY || '';
  }

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      const errorMsg =
        'EmailJS credentials are not set. Add EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY to backend/.env';
      console.warn(`\x1b[33m[EmailJS Notice]\x1b[0m ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
    }

    try {
      // Extract OTP if present in input or subject line
      const extractedOtp = input.otp || input.subject.match(/\b\d{6}\b/)?.[0] || '';

      const payload: Record<string, any> = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        template_params: {
          to_name: input.to.split('@')[0],
          to_email: input.to,
          email: input.to,
          user_email: input.to,
          recipient: input.to,
          recipient_email: input.to,
          to: input.to,
          reply_to: input.to,
          subject: input.subject,
          message: input.text || `Your ILRDVS verification code is: ${extractedOtp}`,
          passcode: extractedOtp,
          otp: extractedOtp,
          code: extractedOtp,
          otp_code: extractedOtp,
          verification_code: extractedOtp,
          pin: extractedOtp,
          time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };

      if (this.privateKey) {
        payload.accessToken = this.privateKey;
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': process.env.CLIENT_URL || 'http://localhost:3000',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[EmailJS Provider Error]', { status: response.status, error: errorText });

        // If EmailJS blocks non-browser access, provide clear instructions and fallback in dev
        if (errorText.includes('non-browser environments is currently disabled') || errorText.includes('403')) {
          console.warn(
            '\n\x1b[33m[EMAILJS ACTION REQUIRED]\x1b[0m To allow backend Node.js to send emails via EmailJS:\n' +
            '1. Open https://dashboard.emailjs.com/admin/account/security\n' +
            '2. Check "Allow EmailJS API for non-browser applications"\n' +
            '3. Copy your Private Key and paste it as EMAILJS_PRIVATE_KEY in backend/.env\n'
          );

          if (process.env.NODE_ENV !== 'production') {
            console.log(
              `\x1b[36m[DEV BACKUP OTP LOG]\x1b[0m Recipient: ${input.to} | OTP: \x1b[1m\x1b[32m${extractedOtp}\x1b[0m`
            );
            return {
              success: true,
              messageId: `dev-fallback-${Date.now()}`,
            };
          }
        }

        return {
          success: false,
          error: `EmailJS dispatch failed: ${errorText}`,
        };
      }

      return {
        success: true,
        messageId: `emailjs-${Date.now()}`,
      };
    } catch (err: any) {
      console.error('[EmailJS Network Error]', err.message);
      return {
        success: false,
        error: 'Email gateway connection failed. Please try again later.',
      };
    }
  }
}

/**
 * Development Sandbox Email Provider
 * Formats and logs email dispatch to local developer console when in development.
 * Allows seamless offline testing without a third-party API key.
 */
export class DevEmailProvider implements EmailProvider {
  readonly name = 'DEV_SANDBOX';

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    console.log(
      `\n\x1b[36m┌────────────────────────────────────────────────────────────────────────┐\x1b[0m\n` +
      `\x1b[36m│ [DEV EMAIL SANDBOX] TRANSACTIONAL EMAIL DISPATCHED                     │\x1b[0m\n` +
      `\x1b[36m├────────────────────────────────────────────────────────────────────────┤\x1b[0m\n` +
      `\x1b[36m│\x1b[0m \x1b[1mTo:\x1b[0m      ${input.to.padEnd(58)} \x1b[36m│\x1b[0m\n` +
      `\x1b[36m│\x1b[0m \x1b[1mSubject:\x1b[0m ${input.subject.padEnd(58)} \x1b[36m│\x1b[0m\n` +
      `\x1b[36m│\x1b[0m \x1b[1mMessage:\x1b[0m ${(input.text || '').padEnd(58)} \x1b[36m│\x1b[0m\n` +
      `\x1b[36m└────────────────────────────────────────────────────────────────────────┘\x1b[0m\n`
    );

    return {
      success: true,
      messageId: `dev-msg-${Date.now()}`,
    };
  }
}

/**
 * Factory function to retrieve configured EmailProvider
 */
export function getEmailProvider(): EmailProvider {
  const isProduction = process.env.NODE_ENV === 'production';
  const providerType = (process.env.EMAIL_PROVIDER || 'emailjs').toLowerCase();
  const serviceId = (process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim();
  const templateId = (process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '').trim();
  const publicKey = (process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim();
  const privateKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();

  const hasValidEmailJS = Boolean(serviceId && templateId && publicKey);

  // 1. If Dev Sandbox explicitly requested
  if (providerType === 'dev' || providerType === 'sandbox') {
    return new DevEmailProvider();
  }

  // 2. If valid EmailJS configuration is present, use EmailJS
  if (hasValidEmailJS) {
    return new EmailJSEmailProvider(serviceId, templateId, publicKey, privateKey);
  }

  // 3. If in local development or API keys are not configured, fall back to Dev sandbox (OTP logged to console)
  if (!isProduction) {
    console.warn(
      '\x1b[33m[EMAIL CONFIG NOTICE]\x1b[0m EmailJS keys not set. Automatically falling back to DevEmailProvider sandbox (OTP is printed to console). To send real emails, set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY in backend/.env'
    );
    return new DevEmailProvider();
  }

  // 4. In production without keys, return EmailJS which will yield descriptive configuration notice
  return new EmailJSEmailProvider();
}
