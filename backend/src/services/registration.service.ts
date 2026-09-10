import { User, IUser } from '../models/User.js';
import { OfficerApplication, IOfficerApplication, OfficerApplicationStatus } from '../models/OfficerApplication.js';
import {
  CitizenRegisterInput,
  OfficerRegisterInput,
  VerifyRegistrationOtpInput,
} from '../schemas/registration.schema.js';
import { EmailOTPService } from './emailOtp.service.js';
import { EmailService } from './email.service.js';
import { generateToken } from './auth.service.js';
import { logAudit } from '../utils/audit.js';

export class RegistrationService {
  /**
   * Register a new Citizen (self-service)
   */
  public static async registerCitizen(input: CitizenRegisterInput, ipAddress?: string) {
    const email = input.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.accountStatus === 'ACTIVE' && existingUser.emailVerified) {
        throw new Error('An account with this email already exists. Please log in.');
      }
      // If previous registration was pending, update details
      existingUser.name = input.name.trim();
      existingUser.password = input.password;
      existingUser.preferredLanguage = input.preferredLanguage || 'en';
      if (input.phone) existingUser.mobile = input.phone.trim();
      existingUser.accountStatus = 'PENDING_VERIFICATION';
      await existingUser.save();
    } else {
      await User.create({
        name: input.name.trim(),
        email,
        password: input.password,
        role: 'CITIZEN',
        department: 'Citizen Services',
        district: 'Maharashtra',
        status: 'INACTIVE',
        accountStatus: 'PENDING_VERIFICATION',
        emailVerified: false,
        preferredLanguage: input.preferredLanguage || 'en',
        mobile: input.phone ? input.phone.trim() : undefined,
      });
    }

    // Dispatch real email OTP with 'REGISTRATION' purpose
    const otpRes = await EmailOTPService.requestEmailOTP(email, 'REGISTRATION', ipAddress);
    if (!otpRes.success) {
      throw new Error(otpRes.message || 'Failed to dispatch verification code to email.');
    }

    await logAudit({
      action: 'CITIZEN_REGISTRATION_CREATED',
      resourceType: 'User',
      description: `Citizen self-registration created for ${email}. Awaiting OTP verification.`,
      ipAddress,
    });

    return {
      email,
      expiresIn: otpRes.expiresIn,
      resendAvailableIn: otpRes.resendAvailableIn,
      otp: otpRes.otp,
      message: 'A 6-digit verification code has been dispatched to your email address.',
    };
  }

  /**
   * Register an Officer (controlled access application)
   */
  public static async registerOfficer(input: OfficerRegisterInput, ipAddress?: string) {
    const email = input.email.toLowerCase().trim();
    const employeeId = input.employeeId.trim();

    // Check email domain restrictions if configured
    if (process.env.OFFICER_EMAIL_DOMAIN_RESTRICTION === 'true') {
      const allowedDomains = (process.env.OFFICER_ALLOWED_EMAIL_DOMAINS || 'gov.in,nic.in,maharashtra.gov.in')
        .split(',')
        .map((d) => d.trim().toLowerCase());
      const domain = email.split('@')[1];
      const isAllowed = allowedDomains.some((ad) => domain.endsWith(ad));
      if (!isAllowed) {
        throw new Error(
          `Official email domain not permitted. Must belong to: ${allowedDomains.join(', ')}`
        );
      }
    }

    // Check for duplicate employee ID
    const existingAppWithId = await OfficerApplication.findOne({ employeeId });
    if (existingAppWithId && existingAppWithId.email !== email) {
      throw new Error('An officer application with this Employee ID has already been registered.');
    }

    // Check user
    let user = await User.findOne({ email });
    if (user && user.accountStatus === 'ACTIVE') {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    if (user) {
      user.name = input.name.trim();
      user.password = input.password;
      user.department = input.department.trim();
      user.district = input.district.trim();
      user.role = 'OFFICER';
      user.accountStatus = 'PENDING_VERIFICATION';
      user.preferredLanguage = input.preferredLanguage || 'en';
      if (input.phone) user.mobile = input.phone.trim();
      await user.save();
    } else {
      user = await User.create({
        name: input.name.trim(),
        email,
        password: input.password,
        role: 'OFFICER',
        department: input.department.trim(),
        district: input.district.trim(),
        status: 'INACTIVE',
        accountStatus: 'PENDING_VERIFICATION',
        emailVerified: false,
        preferredLanguage: input.preferredLanguage || 'en',
        mobile: input.phone ? input.phone.trim() : undefined,
      });
    }

    // Create or update OfficerApplication record
    let app = await OfficerApplication.findOne({ userId: user._id });
    if (app) {
      app.name = input.name.trim();
      app.employeeId = employeeId;
      app.department = input.department.trim();
      app.designation = input.designation.trim();
      app.office = input.office.trim();
      app.district = input.district.trim();
      app.taluka = input.taluka ? input.taluka.trim() : undefined;
      app.phone = input.phone ? input.phone.trim() : undefined;
      app.preferredLanguage = input.preferredLanguage || 'en';
      app.status = 'PENDING_EMAIL_VERIFICATION';
      await app.save();
    } else {
      app = await OfficerApplication.create({
        userId: user._id,
        name: input.name.trim(),
        email,
        employeeId,
        department: input.department.trim(),
        designation: input.designation.trim(),
        office: input.office.trim(),
        district: input.district.trim(),
        taluka: input.taluka ? input.taluka.trim() : undefined,
        phone: input.phone ? input.phone.trim() : undefined,
        preferredLanguage: input.preferredLanguage || 'en',
        emailVerified: false,
        status: 'PENDING_EMAIL_VERIFICATION',
      });
    }

    // Dispatch real email OTP
    const otpRes = await EmailOTPService.requestEmailOTP(email, 'REGISTRATION', ipAddress);
    if (!otpRes.success) {
      throw new Error(otpRes.message || 'Failed to dispatch verification code to email.');
    }

    await logAudit({
      userId: user._id as any,
      action: 'OFFICER_APPLICATION_CREATED',
      resourceType: 'OfficerApplication',
      resourceId: app._id.toString(),
      description: `Officer application submitted by ${input.name} (${employeeId}) in district ${input.district}`,
      ipAddress,
    });

    return {
      email,
      employeeId,
      expiresIn: otpRes.expiresIn,
      resendAvailableIn: otpRes.resendAvailableIn,
      otp: otpRes.otp,
      message: 'A 6-digit verification code has been dispatched to your official email.',
    };
  }

  /**
   * Verify Registration OTP for Citizen or Officer
   */
  public static async verifyRegistrationOtp(input: VerifyRegistrationOtpInput, ipAddress?: string) {
    const email = input.email.toLowerCase().trim();

    // Verify OTP code
    const verifyRes = await EmailOTPService.verifyEmailOTP(email, input.otp, 'REGISTRATION', ipAddress);
    if (!verifyRes.verified) {
      throw new Error(verifyRes.message || 'Invalid or expired verification code.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Registration record not found. Please restart the registration process.');
    }

    // Citizen Path: Automatically activates account
    if (input.registrationType === 'CITIZEN' || user.role === 'CITIZEN') {
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      user.status = 'ACTIVE';
      user.accountStatus = 'ACTIVE';
      await user.save();

      await logAudit({
        userId: user._id as any,
        action: 'CITIZEN_EMAIL_VERIFIED',
        resourceType: 'User',
        resourceId: user._id.toString(),
        description: `Citizen ${email} email verified successfully. Account activated.`,
        ipAddress,
      });

      const token = generateToken(user);
      return {
        user: user.toJSON(),
        token,
        role: 'CITIZEN',
        accountStatus: 'ACTIVE',
        message: 'Email verified successfully. Your citizen account is now active.',
      };
    }

    // Officer Path: Marks email verified, but moves to PENDING_APPROVAL
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.accountStatus = 'PENDING_APPROVAL';
    user.status = 'INACTIVE'; // Remains inactive until Admin approval
    await user.save();

    await OfficerApplication.findOneAndUpdate(
      { userId: user._id },
      { emailVerified: true, status: 'PENDING_APPROVAL' }
    );

    await logAudit({
      userId: user._id as any,
      action: 'OFFICER_EMAIL_VERIFIED',
      resourceType: 'OfficerApplication',
      description: `Officer applicant ${email} verified email. Application status set to PENDING_APPROVAL.`,
      ipAddress,
    });

    const token = generateToken(user);
    return {
      user: user.toJSON(),
      token,
      role: 'OFFICER',
      accountStatus: 'PENDING_APPROVAL',
      message:
        'Official email verified successfully. Your officer access application is awaiting administrative review.',
    };
  }

  /**
   * List Officer Applications for Admin Dashboard
   */
  public static async listOfficerApplications(filters: {
    status?: string;
    district?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }

    if (filters.district && filters.district !== 'ALL') {
      query.district = new RegExp(`^${filters.district}$`, 'i');
    }

    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
        { office: searchRegex },
      ];
    }

    const [applications, total] = await Promise.all([
      OfficerApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email status accountStatus lastLogin')
        .populate('approvedBy', 'name email')
        .populate('rejectedBy', 'name email')
        .lean(),
      OfficerApplication.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single Officer Application Details
   */
  public static async getOfficerApplicationById(id: string) {
    if (!id || typeof id !== 'string' || !id.trim()) {
      throw new Error('Invalid application identifier.');
    }

    const application = await OfficerApplication.findById(id)
      .populate('userId', 'name email status accountStatus createdAt lastLogin')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!application) {
      throw new Error('Officer application not found.');
    }

    return application;
  }

  /**
   * Approve an Officer Application (Admin Only)
   */
  public static async approveOfficerApplication(
    applicationId: string,
    adminUser: IUser,
    ipAddress?: string
  ) {
    const app = await OfficerApplication.findById(applicationId);
    if (!app) {
      throw new Error('Officer application not found.');
    }

    // Security: Prevent self-approval
    if (app.userId.toString() === adminUser._id.toString()) {
      throw new Error('Security policy violation: Administrators cannot approve their own officer applications.');
    }

    if (app.status === 'APPROVED') {
      throw new Error('This application has already been approved.');
    }

    // Update Application
    app.status = 'APPROVED';
    app.approvedBy = adminUser._id as any;
    app.approvedAt = new Date();
    await app.save();

    // Activate Officer User Account
    await User.findByIdAndUpdate(app.userId, {
      role: 'OFFICER',
      accountStatus: 'ACTIVE',
      status: 'ACTIVE',
      department: app.department,
      district: app.district,
    });

    // Audit Logging
    await logAudit({
      userId: adminUser._id as any,
      action: 'OFFICER_APPLICATION_APPROVED',
      resourceType: 'OfficerApplication',
      resourceId: app._id.toString(),
      description: `Administrator ${adminUser.name} (${adminUser.email}) approved officer application for ${app.name} (${app.employeeId})`,
      ipAddress,
    });

    await logAudit({
      userId: app.userId,
      action: 'USER_ACCOUNT_ACTIVATED',
      resourceType: 'User',
      resourceId: app.userId.toString(),
      description: `Officer account activated with role OFFICER in department ${app.department}`,
      ipAddress,
    });

    return {
      success: true,
      message: `Officer application for ${app.name} has been approved. Account is now ACTIVE.`,
      application: app,
    };
  }

  /**
   * Reject an Officer Application (Admin Only)
   */
  public static async rejectOfficerApplication(
    applicationId: string,
    reason: string,
    adminUser: IUser,
    ipAddress?: string
  ) {
    const app = await OfficerApplication.findById(applicationId);
    if (!app) {
      throw new Error('Officer application not found.');
    }

    // Security: Prevent self-rejection
    if (app.userId.toString() === adminUser._id.toString()) {
      throw new Error('Security policy violation: Administrators cannot reject their own accounts.');
    }

    if (app.status === 'REJECTED') {
      throw new Error('This application has already been rejected.');
    }

    app.status = 'REJECTED';
    app.rejectionReason = reason;
    app.rejectedBy = adminUser._id as any;
    app.rejectedAt = new Date();
    await app.save();

    // Disable User Account
    await User.findByIdAndUpdate(app.userId, {
      accountStatus: 'DISABLED',
      status: 'INACTIVE',
    });

    await logAudit({
      userId: adminUser._id as any,
      action: 'OFFICER_APPLICATION_REJECTED',
      resourceType: 'OfficerApplication',
      resourceId: app._id.toString(),
      description: `Administrator ${adminUser.name} rejected officer application for ${app.name}. Reason: ${reason}`,
      ipAddress,
    });

    return {
      success: true,
      message: `Officer application for ${app.name} has been rejected.`,
      application: app,
    };
  }

  /**
   * Request Clarification for an Officer Application (Admin Only)
   */
  public static async requestOfficerClarification(
    applicationId: string,
    message: string,
    adminUser: IUser,
    ipAddress?: string
  ) {
    const app = await OfficerApplication.findById(applicationId);
    if (!app) {
      throw new Error('Officer application not found.');
    }

    app.status = 'ACTION_REQUIRED';
    app.clarificationMessage = message;
    await app.save();

    await logAudit({
      userId: adminUser._id as any,
      action: 'OFFICER_CLARIFICATION_REQUESTED',
      resourceType: 'OfficerApplication',
      resourceId: app._id.toString(),
      description: `Clarification requested for ${app.name} (${app.employeeId}): "${message}"`,
      ipAddress,
    });

    return {
      success: true,
      message: `Clarification request sent to ${app.name}.`,
      application: app,
    };
  }

  /**
   * Get application status for the authenticated officer applicant
   */
  public static async getOfficerSelfStatus(userId: string) {
    const application = await OfficerApplication.findOne({ userId })
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!application) {
      throw new Error('No officer application found for your account.');
    }

    return application;
  }
}
