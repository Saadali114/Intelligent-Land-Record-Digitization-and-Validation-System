import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, CheckCircle2, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';
import { OtpInput } from '../ui/OtpInput';
import { authService } from '../../services/auth.service';

interface StepIdentityVerificationProps {
  workflow: VerificationWorkflowData;
  onComplete: () => void;
}

export const StepIdentityVerification: React.FC<StepIdentityVerificationProps> = ({
  workflow,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verified, setVerified] = useState(workflow.applicant.identityStatus === 'VERIFIED');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expiresIn, setExpiresIn] = useState(300);

  const applicantEmail = workflow.applicant.email || 'citizen@example.com';

  const handleSendOtp = async () => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      const res = await authService.sendEmailOtp(applicantEmail, 'EMAIL_VERIFICATION');
      setOtpSent(true);
      if (res.resendAvailableIn) setResendCooldown(res.resendAvailableIn);
      if (res.expiresIn) setExpiresIn(res.expiresIn);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to send Email OTP. Please check your network and try again.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const res = await authService.verifyEmailOtp(applicantEmail, otpCode, 'EMAIL_VERIFICATION');
      if (res.verified) {
        setVerified(true);
      } else {
        setErrorMessage(res.message || 'Invalid verification code.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage(null);
    try {
      const res = await authService.resendEmailOtp(applicantEmail, 'EMAIL_VERIFICATION');
      if (res.resendAvailableIn) setResendCooldown(res.resendAvailableIn);
      if (res.expiresIn) setExpiresIn(res.expiresIn);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
      throw err;
    }
  };


  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            {t('verificationWorkflow.pillar1Title', '1. Identity Verification')}
          </h2>
          <p className="text-xs text-slate-400">
            {t(
              'verificationWorkflow.pillar1Desc',
              'Verify applicant identity via registered account and one-time password (OTP).'
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('verificationWorkflow.applicantName', 'Applicant Full Name')}
            </label>
            <div className="px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 font-medium">
              {workflow.applicant.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('verificationWorkflow.registeredEmail', 'Registered Email Address')}
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{applicantEmail}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('verificationWorkflow.accountStatus', 'Account Status')}
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('verificationWorkflow.accountStatusValue')}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-3">
              <KeyRound className="w-4 h-4 text-sky-400" />
              <span>{t('verificationWorkflow.enterOtp', 'Enter 6-Digit Verification OTP')}</span>
            </div>

            {verified ? (
              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs mb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {t(
                      'verificationWorkflow.identityVerifiedSuccess',
                      'Email Verified via Real Inbox OTP'
                    )}
                  </span>
                  <span className="text-[10px] uppercase font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                    {t('common.verified')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  {t('verificationWorkflow.identityVerifiedDesc', { name: workflow.applicant.name, email: applicantEmail })}
                </p>
              </div>
            ) : !otpSent ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  {t('verificationWorkflow.sendOtpPrompt')}{' '}
                  <span className="font-mono text-white font-semibold">{applicantEmail}</span>.
                </p>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('verificationWorkflow.sendingOtp')}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>{t('verificationWorkflow.sendEmailOtp', 'Send Email Verification OTP')}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <OtpInput
                  length={6}
                  email={applicantEmail}
                  onComplete={handleVerifyOtp}
                  onResend={handleResendOtp}
                  isLoading={isVerifying}
                  errorMessage={errorMessage}
                  resendCooldownSeconds={resendCooldown}
                  expirySeconds={expiresIn}
                />
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onComplete}
              disabled={!verified}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-2 ${
                verified
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{t('verificationWorkflow.continueToUpload', 'Continue to Document Upload')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
