/**
 * Email Provider Abstraction & Implementations
 * Supports Resend REST API (Production) and DevEmailProvider (Local Sandbox)
 */

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
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
 * Resend Email Provider
 * Official REST API v1 integration (no external npm dependencies required)
 * Documentation: https://resend.com/docs/api-reference/emails/send-email
 */
export class ResendEmailProvider implements EmailProvider {
  readonly name = 'RESEND';
  private apiKey: string;
  private fromAddress: string;

  constructor(apiKey?: string, fromAddress?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY || '';
    const fromName = process.env.EMAIL_FROM_NAME || 'ILRDVS Land Governance';
    const rawFrom = fromAddress || process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';
    this.fromAddress = rawFrom.includes('<') ? rawFrom : `${fromName} <${rawFrom}>`;
  }

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    if (!this.apiKey) {
      throw new Error('Resend configuration error: RESEND_API_KEY environment variable is not set.');
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromAddress,
          to: [input.to],
          subject: input.subject,
          html: input.html,
          text: input.text || '',
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        const errorMsg = data.message || `Resend API returned status ${response.status}`;
        console.error('[Resend Provider Error]', { status: response.status, error: errorMsg });
        return {
          success: false,
          error: errorMsg,
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (err: any) {
      console.error('[Resend Network Error]', err.message);
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
 * Strictly blocked when NODE_ENV=production.
 */
export class DevEmailProvider implements EmailProvider {
  readonly name = 'DEV_SANDBOX';

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: DevEmailProvider cannot be used in production mode.');
    }
  }

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    const maskedTo = input.to.replace(/^(.)(.*)(@.*)$/, (_, first, middle, domain) => {
      return `${first}${'*'.repeat(Math.min(middle.length, 4))}${domain}`;
    });

    console.log(
      `\x1b[36m[DEV EMAIL SANDBOX]\x1b[0m Verification email dispatched to: \x1b[1m${maskedTo}\x1b[0m | Subject: "${input.subject}"`
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
  const providerType = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();

  // If in production or explicitly configured with Resend credentials
  if (isProduction || process.env.RESEND_API_KEY) {
    if (providerType === 'resend') {
      return new ResendEmailProvider();
    }
  }

  // Fallback to development sandbox for local testing when API key is pending
  return new DevEmailProvider();
}
