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
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    const savedOtp = sessionStorage.getItem('pending_registration_otp');
    if (savedOtp) {
      setPendingOtp(savedOtp);
    }
  }, [searchParams]);

  const handleVerifyOtp = async (otpCode: string) => {
    if (!email) {
      setErrorMessage(
        t('registration.missingOfficialEmail', {
          defaultValue: 'Missing official email address. Please restart application.',
        })
      );
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

      // Save token for status check and officer dashboard session
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      if (res.user) {
        const officerUser = {
          ...res.user,
          role: 'OFFICER',
        };
        localStorage.setItem('user', JSON.stringify(officerUser));
      } else {
        localStorage.setItem(
          'user',
          JSON.stringify({
            email,
            role: 'OFFICER',
            accountStatus: 'ACTIVE',
          })
        );
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          t('registration.verificationFailed', {
            defaultValue: 'Verification failed. Please check the code and try again.',
          })
      );
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
      setErrorMessage(
        err.message ||
          t('registration.resendCodeFailed', {
            defaultValue: 'Failed to resend verification code.',
          })
      );
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
              {pendingOtp && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 shadow-xs animate-in fade-in">
                  <div className="font-semibold text-amber-800">✉️ Official Verification Code Dispatched:</div>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-[11px] text-amber-700">Sent to {email}:</span>
                    <code className="font-mono font-black text-sm bg-white px-2.5 py-0.5 rounded border border-amber-300 text-amber-950 tracking-widest">
                      {pendingOtp}
                    </code>
                  </div>
                </div>
              )}

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
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t('registration.officerVerifiedTitle', { defaultValue: 'Official Email Verified' })}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {t('registration.officerActiveMsg', {
                    defaultValue:
                      'Your official email has been verified and your officer workspace session is activated. You can now access the verification queue and dashboard.',
                  })}
                </p>
                {email && (
                  <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50/80 border border-emerald-200 rounded-lg p-2 font-medium">
                    ✉️ Onboarding email dispatched to <strong>{email}</strong>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  href="/verification"
                  className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t('registration.goToVerificationQueue', { defaultValue: 'Go to Officer Verification Workstation' })}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t('registration.goToOfficerDashboard', { defaultValue: 'Go to Operations Dashboard' })}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="pt-1">
                  <Link
                    href="/officer/application-status"
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    {t('registration.viewApplicationStatus', { defaultValue: 'View Application Status Tracker' })}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500">
        <div>
          {t('common.portalGovNotice', {
            defaultValue: 'ILRDVS — Government of Maharashtra Revenue & Forest Department Land Record Governance Portal',
          })}
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
