'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { OtpInput } from '../../../../components/ui/OtpInput';
import { LanguageSwitcher } from '../../../../components/ui/LanguageSwitcher';
import { authService } from '../../../../services/auth.service';
import { citizenService } from '../../../../services/citizen.service';

function CitizenVerifyEmailContent() {
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
      setErrorMessage(
        t('registration.missingRegistrationEmail', {
          defaultValue: 'Missing registration email address. Please restart registration.',
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
        registrationType: 'CITIZEN',
      });

      // Establish session
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        citizenService.login({
          name: res.user.name,
          email: res.user.email,
          mobile: res.user.mobileNumber || '',
          district: res.user.district || 'Pune',
          taluka: res.user.taluka || 'Haveli',
          village: res.user.village || 'Khadakwasla',
          preferredLanguage: res.user.preferredLanguage || 'English',
        });
      } else {
        citizenService.login(email);
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
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-blue-900 font-semibold">{t('registration.citizenPortal', { defaultValue: 'Citizen Portal' })}</span>
              </div>
              <div className="text-xs text-slate-500">{t('registration.verifyEmailHeader', { defaultValue: 'Email Identity Verification' })}</div>
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
                email={email || 'citizen@example.com'}
                onComplete={handleVerifyOtp}
                onResend={handleResendOtp}
                isLoading={isVerifying}
                errorMessage={errorMessage}
                resendCooldownSeconds={60}
                expirySeconds={300}
              />

              <div className="text-center pt-5 mt-5 border-t border-slate-100">
                <Link
                  href="/register/citizen"
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
                  {t('registration.registrationComplete', { defaultValue: 'Registration Complete' })}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {t('registration.accountActiveMsg', {
                    defaultValue:
                      'Your email has been verified. Your ILRDVS citizen account is now active and ready to submit records.',
                  })}
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/portal"
                  className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{t('registration.goToCitizenPortal', { defaultValue: 'Go to Citizen Portal' })}</span>
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
          {t('common.portalGovNotice', {
            defaultValue: 'ILRDVS — Government of Maharashtra Revenue & Forest Department Land Record Governance Portal',
          })}
        </div>
      </footer>
    </div>
  );
}

export default function CitizenVerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CitizenVerifyEmailContent />
    </React.Suspense>
  );
}
