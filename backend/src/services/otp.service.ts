import { OTPVerification, OTPPurpose } from '../models/OTPVerification.js';
import { User } from '../models/User.js';
import { getOTPProvider } from './otp/otp.provider.js';
import { normalizeIndianMobile, isValidIndianMobile, maskMobile } from '../utils/phone.js';
import { logAudit } from '../utils/audit.js';

export interface SendOTPResult {
  success: boolean;
  message: string;
  expiresIn?: number;
  resendAvailableIn?: number;
}

export interface VerifyOTPResult {
  success: boolean;
  verified: boolean;
  message: string;
}

export class OTPService {
  private static getExpiryMinutes(): number {
    return parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
  }

  private static getCooldownSeconds(): number {
    return parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);
  }

  private static getMaxAttempts(): number {
    return parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
  }

  private static getMaxHourlyRequests(): number {
    return parseInt(process.env.OTP_MAX_REQUESTS_PER_HOUR || '5', 10);
  }

  /**
   * Request an OTP to be sent via SMS provider
   */
  public static async requestOTP(
    rawMobile: string,
    purpose: OTPPurpose = 'MOBILE_VERIFICATION',
    ipAddress?: string
  ): Promise<SendOTPResult> {
    if (!isValidIndianMobile(rawMobile)) {
      return {
        success: false,
        message: 'Invalid Indian mobile number. Please enter a valid 10-digit mobile number.',
      };
    }

    const mobile = normalizeIndianMobile(rawMobile);
    const cooldownSeconds = this.getCooldownSeconds();
    const expiryMinutes = this.getExpiryMinutes();
    const maxHourly = this.getMaxHourlyRequests();

    // 1. Check Hourly Rate Limit
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequestsCount = await OTPVerification.countDocuments({
      mobile,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentRequestsCount >= maxHourly) {
      await logAudit({
        action: 'OTP_RATE_LIMITED',
        resourceType: 'OTP',
        description: `Too many OTP requests for ${maskMobile(mobile)} in 1 hour`,
        ipAddress,
      });

      return {
        success: false,
        message: 'Too many OTP requests for this number. Please try again after some time.',
      };
    }

    // 2. Check Cooldown on Last Sent OTP
    const latestRecord = await OTPVerification.findOne({
      mobile,
      purpose,
    }).sort({ createdAt: -1 });

    if (latestRecord && latestRecord.status === 'PENDING') {
      const elapsedSeconds = Math.floor((Date.now() - latestRecord.lastSentAt.getTime()) / 1000);
      if (elapsedSeconds < cooldownSeconds) {
        const remainingSeconds = cooldownSeconds - elapsedSeconds;
        return {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
          resendAvailableIn: remainingSeconds,
        };
      }
    }

    // 3. Delegate to SMS Provider
    const provider = getOTPProvider();
    const providerRes = await provider.sendOTP(mobile, expiryMinutes);

    if (!providerRes.success) {
      await logAudit({
        action: 'OTP_PROVIDER_ERROR',
        resourceType: 'OTP',
        description: `Failed to dispatch SMS to ${maskMobile(mobile)} via ${provider.name}`,
        ipAddress,
      });

      return {
        success: false,
        message: providerRes.message || 'Unable to send OTP at this time. Please try again.',
      };
    }

    // 4. Save/Update Verification State in MongoDB
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await OTPVerification.create({
      mobile,
      purpose,
      provider: provider.name === 'MSG91' ? 'MSG91' : 'SANDBOX',
      providerRequestId: providerRes.requestId,
      status: 'PENDING',
      attempts: 0,
      expiresAt,
      lastSentAt: new Date(),
    });

    // 5. Audit Log Event (Strictly without OTP value)
    await logAudit({
      action: 'OTP_SENT',
      resourceType: 'OTP',
      description: `OTP dispatched to ${maskMobile(mobile)} via ${provider.name}`,
      ipAddress,
    });

    return {
      success: true,
      message: 'OTP sent successfully to your registered mobile number.',
      expiresIn: expiryMinutes * 60,
      resendAvailableIn: cooldownSeconds,
    };
  }

  /**
   * Verify an OTP submitted by the user
   */
  public static async verifyOTP(
    rawMobile: string,
    otp: string,
    purpose: OTPPurpose = 'MOBILE_VERIFICATION',
    ipAddress?: string
  ): Promise<VerifyOTPResult> {
    if (!isValidIndianMobile(rawMobile)) {
      return {
        success: false,
        verified: false,
        message: 'Invalid Indian mobile number.',
      };
    }

    if (!otp || !/^\d{4,8}$/.test(otp.trim())) {
      return {
        success: false,
        verified: false,
        message: 'Invalid OTP format. OTP must be numerical.',
      };
    }

    const mobile = normalizeIndianMobile(rawMobile);
    const maxAttempts = this.getMaxAttempts();

    // 1. Locate Pending Verification Record
    const verificationRecord = await OTPVerification.findOne({
      mobile,
      purpose,
      status: 'PENDING',
    }).sort({ createdAt: -1 });

    if (!verificationRecord) {
      return {
        success: false,
        verified: false,
        message: 'No active OTP verification found. Please request a new OTP.',
      };
    }

    // 2. Check if Expired
    if (new Date() > verificationRecord.expiresAt) {
      verificationRecord.status = 'EXPIRED';
      await verificationRecord.save();
      return {
        success: false,
        verified: false,
        message: 'OTP has expired. Please request a new verification code.',
      };
    }

    // 3. Check Attempts Count
    if (verificationRecord.attempts >= maxAttempts) {
      verificationRecord.status = 'LOCKED';
      await verificationRecord.save();

      await logAudit({
        action: 'OTP_RATE_LIMITED',
        resourceType: 'OTP',
        description: `Max verification attempts exceeded for ${maskMobile(mobile)}`,
        ipAddress,
      });

      return {
        success: false,
        verified: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Increment attempt count
    verificationRecord.attempts += 1;

    // 4. Delegate to Provider for Verification
    const provider = getOTPProvider();
    const result = await provider.verifyOTP(mobile, otp.trim());

    if (!result.verified) {
      await verificationRecord.save();

      await logAudit({
        action: 'OTP_VERIFICATION_FAILED',
        resourceType: 'OTP',
        description: `Failed OTP attempt (${verificationRecord.attempts}/${maxAttempts}) for ${maskMobile(mobile)}`,
        ipAddress,
      });

      return {
        success: false,
        verified: false,
        message: result.message || 'Invalid OTP code. Please check and try again.',
      };
    }

    // 5. Verification Succeeded
    verificationRecord.status = 'VERIFIED';
    verificationRecord.verifiedAt = new Date();
    await verificationRecord.save();

    // 6. Update user record if user with this mobile or email exists
    const matchingUser = await User.findOne({ mobile });
    if (matchingUser) {
      matchingUser.mobileVerified = true;
      matchingUser.mobileVerifiedAt = new Date();
      matchingUser.mobileVerificationMethod = 'SMS';
      await matchingUser.save();
    }

    // 7. Audit Log Success
    await logAudit({
      action: 'OTP_VERIFICATION_SUCCESS',
      resourceType: 'OTP',
      description: `Mobile ${maskMobile(mobile)} successfully authenticated via ${provider.name}`,
      ipAddress,
    });

    return {
      success: true,
      verified: true,
      message: 'Mobile number verified successfully.',
    };
  }

  /**
   * Resend an OTP adhering to cooldown rules
   */
  public static async resendOTP(
    rawMobile: string,
    purpose: OTPPurpose = 'MOBILE_VERIFICATION',
    ipAddress?: string
  ): Promise<SendOTPResult> {
    return this.requestOTP(rawMobile, purpose, ipAddress);
  }
}
