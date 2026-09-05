'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  ShieldCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { citizenService } from '../../../services/citizen.service';

export default function CitizenLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('9822012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number registered with Aadhaar.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('739241'); // autofill realistic demo OTP
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP received on your mobile.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      citizenService.login(`+91 ${mobileNumber}`, 'Rahul Patil');
      router.push('/portal');
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    citizenService.login('+91 98220 12345', 'Rahul Patil');
    router.push('/portal');
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
              <div className="text-xs text-slate-500">
                {t('common.portalFullName')}
              </div>
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
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8">
          {/* Badge */}
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              {t('common.aadhaarVerified')}
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{t('auth.citizenLoginTitle')}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('auth.citizenLoginSubtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('auth.mobileLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('auth.mobilePlaceholder')}
                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('auth.mobileHelp')}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={loading}
              >
                {t('auth.sendOtp')} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  {t('auth.otpSent')} (+91 {mobileNumber})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('auth.otpLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="739241"
                    className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-mono font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-slate-500 hover:text-slate-800 underline"
                >
                  {t('auth.changeMobile')}
                </button>
                <button
                  type="button"
                  onClick={() => setOtp('739241')}
                  className="text-blue-900 font-semibold hover:underline"
                >
                  {t('auth.resendOtp')}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={loading}
              >
                {t('auth.verifyAndLogin')} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          )}

          {/* Quick Demo Login One-Click Button */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Fast Demo / Evaluation Access
            </div>
            <button
              onClick={handleQuickDemoLogin}
              type="button"
              className="w-full py-2.5 px-4 rounded-lg bg-amber-50 border border-amber-300 hover:bg-amber-100/80 text-amber-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('auth.quickDemoLogin')}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              {t('auth.demoLoginNote')}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-900"
            >
              <Lock className="w-3.5 h-3.5" />
              {t('auth.officialStaffLogin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          {t('common.stateGovt')} &bull; {t('common.revenueDept')} &bull; Powered by {t('common.portalName')}
        </p>
      </footer>
    </div>
  );
}
