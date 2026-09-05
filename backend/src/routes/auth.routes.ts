import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { sendOtp, verifyOtp, resendOtp } from '../controllers/otp.controller.js';
import { sendEmailOtp, verifyEmailOtp, resendEmailOtp } from '../controllers/emailOtp.controller.js';
import {
  registerCitizen,
  registerOfficer,
  verifyRegistrationOtp,
  getOfficerSelfStatus,
} from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema.js';
import { SendOtpSchema, VerifyOtpSchema, ResendOtpSchema } from '../schemas/otp.schema.js';
import { SendEmailOtpSchema, VerifyEmailOtpSchema, ResendEmailOtpSchema } from '../schemas/emailOtp.schema.js';
import {
  CitizenRegisterSchema,
  OfficerRegisterSchema,
  VerifyRegistrationOtpSchema,
} from '../schemas/registration.schema.js';

const router = Router();

// Citizen & Officer Dedicated Registration Pathways
router.post('/register/citizen', validateBody(CitizenRegisterSchema), registerCitizen);
router.post('/register/officer', validateBody(OfficerRegisterSchema), registerOfficer);
router.post('/verify-registration-otp', validateBody(VerifyRegistrationOtpSchema), verifyRegistrationOtp);
router.get('/officer/status', authenticate, getOfficerSelfStatus);

// Standard Password Authentication (Existing)
router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

// Real Email OTP Operations (Resend / Dev Provider)
router.post('/email-otp/send', validateBody(SendEmailOtpSchema), sendEmailOtp);
router.post('/email-otp/verify', validateBody(VerifyEmailOtpSchema), verifyEmailOtp);
router.post('/email-otp/resend', validateBody(ResendEmailOtpSchema), resendEmailOtp);

// Real SMS OTP Operations (MSG91 SendOTP Engine - Deprecated / Optional)
router.post('/otp/send', validateBody(SendOtpSchema), sendOtp);
router.post('/otp/verify', validateBody(VerifyOtpSchema), verifyOtp);
router.post('/otp/resend', validateBody(ResendOtpSchema), resendOtp);

export default router;


