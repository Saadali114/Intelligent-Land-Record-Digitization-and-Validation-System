'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { OtpInput } from '../../../../components/ui/OtpInput';
import { LanguageSwitcher } from '../../../../components/ui/LanguageSwitcher';
import { authService } from '../../../../services/auth.service';

function OfficerVerifyEmailContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyOtp = async (otpCode: string) => {
    if (!email) {
      setErrorMessage('Missing official email address. Please restart application.');
      return;
    }
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await authService.verifyRegistrationOtp({
        email,
        otp: otpCode,
        registrationType: 'OFFICER',
      });

      // Save token for status check
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setErrorMessage(null);
    try {
      await authService.resendEmailOtp(email, 'REGISTRATION');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/register" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-800 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-amber-800 font-semibold">{t('registration.officerPortal', { defaultValue: 'Revenue Officer Portal' })}</span>
              </div>
              <div className="text-xs text-slate-500">{t('registration.verifyOfficialEmail', { defaultValue: 'Official Email Verification' })}</div>
            </div>
          </Link>

          <LanguageSwitcher variant="header" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
          {!isSuccess ? (
            <div>
              <OtpInput
                length={6}
                email={email || 'officer@example.gov'}
                onComplete={handleVerifyOtp}
                onResend={handleResendOtp}
                isLoading={isVerifying}
                errorMessage={errorMessage}
                resendCooldownSeconds={60}
                expirySeconds={300}
              />

              <div className="text-center pt-5 mt-5 border-t border-slate-100">
                <Link
                  href="/register/officer"
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ← {t('registration.changeEmail', { defaultValue: 'Incorrect email address? Edit details' })}
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t('registration.emailVerifiedPendingApproval', { defaultValue: 'Email Verified • Pending Review' })}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {t('registration.officerPendingMsg', {
                    defaultValue:
                      'Your official email has been verified. Your officer access application is now under administrative review by the district administration.',
                  })}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                <div className="font-semibold">{t('registration.nextStepsTitle', { defaultValue: 'Next Steps:' })}</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                  <li>{t('registration.nextStep1', { defaultValue: 'District administrator will verify your employee credentials.' })}</li>
                  <li>{t('registration.nextStep2', { defaultValue: 'You will receive an email confirmation once approved.' })}</li>
                  <li>{t('registration.nextStep3', { defaultValue: 'You can check your status anytime using the link below.' })}</li>
                </ul>
              </div>

              <div className="pt-3">
                <Link
                  href="/officer/application-status"
                  className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t('registration.viewApplicationStatus', { defaultValue: 'View Application Status Tracker' })}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500">
        <div>
          ILRDVS — Government of Maharashtra Revenue & Forest Department Land Record Governance Portal
        </div>
      </footer>
    </div>
  );
}

export default function OfficerVerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-amber-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OfficerVerifyEmailContent />
    </React.Suspense>
  );
}
