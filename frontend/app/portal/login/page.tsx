'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  ShieldCheck,
  Mail,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import { Button } from '../../../components/ui/Button';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { OtpInput } from '../../../components/ui/OtpInput';
import { citizenService } from '../../../services/citizen.service';
import { authService } from '../../../services/auth.service';

export default function CitizenLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expiresIn, setExpiresIn] = useState(300);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !isValidEmail(email)) {
      setError(
        t('auth.invalidEmailError', {
          defaultValue: 'Please enter a valid email address (e.g. name@domain.com).',
        })
      );
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await authService.sendEmailOtp(email.trim().toLowerCase(), 'LOGIN');
      setOtpSent(true);
      if (res.resendAvailableIn) setResendCooldown(res.resendAvailableIn);
      if (res.expiresIn) setExpiresIn(res.expiresIn);
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.sendEmailOtpFailed', {
            defaultValue: 'Unable to dispatch Email OTP. Please verify email address or try again.',
          })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    if (!otpCode || otpCode.length !== 6) {
      setError(t('auth.otpRequiredSixDigits', { defaultValue: 'Please enter the full 6-digit OTP code.' }));
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await authService.verifyEmailOtp(email.trim().toLowerCase(), otpCode, 'LOGIN');
      if (res.verified) {
        // Authenticate citizen session
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
          citizenService.login(email.trim().toLowerCase());
        }
        router.push('/portal');
      } else {
        setError(res.message || t('auth.invalidOtp', { defaultValue: 'Invalid OTP code.' }));
      }
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.invalidOtp', {
            defaultValue: 'Invalid or expired OTP code. Please check and try again.',
          })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      const res = await authService.resendEmailOtp(email.trim().toLowerCase(), 'LOGIN');
      if (res.resendAvailableIn) setResendCooldown(res.resendAvailableIn);
      if (res.expiresIn) setExpiresIn(res.expiresIn);
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.resendOtpFailed', { defaultValue: 'Unable to resend OTP at this time.' })
      );
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-blue-900 font-semibold">{t('navbar.citizenPortal')}</span>
              </div>
              <div className="text-xs text-slate-500">{t('common.portalFullName')}</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="header" />
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors hidden sm:block"
            >
              ← {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('auth.citizenLoginTitle', { defaultValue: 'Citizen Email Authentication' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('auth.citizenLoginSubtitle', {
                defaultValue: 'Real 6-digit email OTP verification code delivered directly to your inbox.',
              })}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-fade-in">
              <span className="font-bold shrink-0">•</span>
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('auth.emailLabel', { defaultValue: 'Email Address' })}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setError('');
                      setEmail(e.target.value);
                    }}
                    placeholder={t('registration.emailPlaceholderCitizen', { defaultValue: 'citizen@example.com' })}
                    autoComplete="email"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {t('auth.emailHelp', {
                    defaultValue: 'A genuine 6-digit verification code will be dispatched to your inbox via Resend.',
                  })}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={loading}
              >
                {t('auth.sendEmailOtp', { defaultValue: 'Send Verification Code' })} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
                <span>{t('registration.dontHaveAccount', { defaultValue: "Don't have an account?" })} </span>
                <Link href="/register/citizen" className="font-bold text-blue-900 hover:underline">
                  {t('registration.citizenRegisterTab', { defaultValue: 'Citizen Registration' })} &rarr;
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <OtpInput
                length={6}
                email={email}
                onComplete={handleVerifyOtp}
                onResend={handleResendOtp}
                isLoading={loading}
                errorMessage={error}
                resendCooldownSeconds={resendCooldown}
                expirySeconds={expiresIn}
              />

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setError('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ← {t('auth.changeEmail', { defaultValue: 'Use another email address' })}
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Legal Footer Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>
              {t('auth.emailDisclaimer', {
                defaultValue:
                  'Email verification confirms applicant inbox control. Official cadastral rights and land ownership are validated separately via revenue records.',
              })}
            </span>
          </div>
        </div>
      </main>


      {/* Footer Bar */}
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
