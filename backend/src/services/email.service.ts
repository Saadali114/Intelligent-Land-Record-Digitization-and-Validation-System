import { getEmailProvider, SendEmailResult } from './email/email.provider.js';

export interface SendOTPEmailParams {
  to: string;
  otp: string;
  purpose?: string;
  expiryMinutes?: number;
}

export class EmailService {
  /**
   * Generates a clean, responsive HTML email template for ILRDVS verification
   */
  private static renderOTPEmailHtml(otp: string, purposeText: string, expiryMinutes: number): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ILRDVS Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Government Accent Stripe -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #f59e0b 0%, #ffffff 50%, #10b981 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-block; padding: 8px 14px; background-color: #0f172a; border-radius: 8px; margin-bottom: 12px;">
                <span style="color: #fbbf24; font-weight: 800; font-size: 16px; letter-spacing: 1px;">ILRDVS</span>
              </div>
              <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">
                Intelligent Land Record Digitization & Validation System
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
                ${purposeText}
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <p style="margin: 0 0 18px 0; font-size: 14px; color: #334155; line-height: 1.5;">
                Use the one-time verification code below to authenticate your account session:
              </p>

              <!-- Prominent OTP Box -->
              <div style="background-color: #f1f5f9; border: 2px dashed #94a3b8; border-radius: 10px; padding: 18px 24px; margin: 20px 0; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f172a; padding-left: 8px;">
                  ${otp}
                </span>
              </div>

              <!-- Expiry Alert -->
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #dc2626; font-weight: 600;">
                ⏱ This verification code will expire in ${expiryMinutes} minutes.
              </p>

              <!-- Security Notice -->
              <div style="margin-top: 24px; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                  <strong>Security Reminder:</strong> Never share your verification code with anyone. ILRDVS staff or revenue officers will never ask for your code via phone, SMS, or email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8;">
                If you did not request this verification code, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600;">
                ILRDVS • Prototype Verification Environment
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Dispatches OTP verification email via configured provider
   */
  public static async sendOTPEmail(params: SendOTPEmailParams): Promise<SendEmailResult> {
    const { to, otp, purpose = 'EMAIL_VERIFICATION', expiryMinutes = 5 } = params;

    const purposeMap: Record<string, string> = {
      REGISTRATION: 'Citizen Account Registration Verification',
      LOGIN: 'Citizen Portal Authentication Access',
      PASSWORD_RESET: 'Password Reset Authorization',
      EMAIL_VERIFICATION: 'Email Identity Verification',
    };

    const purposeText = purposeMap[purpose] || 'Identity Verification';
    const subject = `Your ILRDVS Verification Code: ${otp}`;
    const html = this.renderOTPEmailHtml(otp, purposeText, expiryMinutes);
    const text = `Your ILRDVS verification code is: ${otp}. This code expires in ${expiryMinutes} minutes. Do not share this code with anyone.`;

    const provider = getEmailProvider();
    return provider.sendEmail({ to, subject, html, text, otp });
  }
}
