'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Smartphone, CheckCircle2, KeyRound, ArrowRight } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepIdentityVerificationProps {
  workflow: VerificationWorkflowData;
  onComplete: () => void;
}

export const StepIdentityVerification: React.FC<StepIdentityVerificationProps> = ({
  workflow,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('742198');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(workflow.applicant.identityStatus === 'VERIFIED');

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 600);
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
              {t('verificationWorkflow.registeredMobile', 'Registered Mobile Number')}
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>{workflow.applicant.mobile}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('verificationWorkflow.accountStatus', 'Account Status')}
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registered Citizen Account • Tier-1 KYC Active</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
              <KeyRound className="w-4 h-4 text-sky-400" />
              <span>{t('verificationWorkflow.enterOtp', 'Enter 6-Digit Verification OTP')}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Demo OTP automatically generated for registered phone: <span className="font-mono text-sky-400">742198</span>
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="742198"
                className="w-full tracking-widest text-center font-mono text-lg py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="text-[11px] text-slate-500 italic mb-4">
              {workflow.applicant.demoNote}
            </div>
          </div>

          <div>
            {verified ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs mb-3">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t(
                    'verificationWorkflow.identityVerifiedSuccess',
                    'Identity Verified via Registered Mobile OTP'
                  )}
                </span>
                <span className="text-[10px] uppercase font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                  PASSED
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || otp.length < 4}
                className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 mb-3"
              >
                {isVerifying ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{t('verificationWorkflow.verifyOtp', 'Verify Identity via OTP')}</span>
                  </>
                )}
              </button>
            )}

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
