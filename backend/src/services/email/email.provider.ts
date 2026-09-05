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
    if (!this.apiKey || this.apiKey.trim() === '' || this.apiKey.startsWith('re_your_')) {
      const errorMsg =
        'RESEND_API_KEY is not set. To send real emails, get a free API key at https://resend.com and add RESEND_API_KEY=re_... to backend/.env';
      console.warn(`\x1b[33m[Resend Notice]\x1b[0m ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
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
  const providerType = (process.env.EMAIL_PROVIDER || '').toLowerCase();
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const hasValidApiKey = Boolean(apiKey && !apiKey.startsWith('re_your_') && apiKey.length > 5);

  // 1. If Dev Sandbox explicitly requested
  if (providerType === 'dev' || providerType === 'sandbox') {
    return new DevEmailProvider();
  }

  // 2. If valid Resend API key is present, use Resend
  if (hasValidApiKey) {
    return new ResendEmailProvider(apiKey);
  }

  // 3. If in local development or API key is not configured, fall back to Dev sandbox
  if (!isProduction) {
    console.warn(
      '\x1b[33m[EMAIL CONFIG NOTICE]\x1b[0m RESEND_API_KEY is not set. Automatically falling back to DevEmailProvider sandbox (OTP is printed to console). To receive real emails, set RESEND_API_KEY in backend/.env'
    );
    return new DevEmailProvider();
  }

  // 4. In production without API key, instantiate Resend which will return a descriptive error
  return new ResendEmailProvider('', process.env.EMAIL_FROM_ADDRESS);
}

