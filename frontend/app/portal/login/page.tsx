'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

import { Button } from '../../../components/ui/Button';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { citizenService } from '../../../services/citizen.service';
import { authService } from '../../../services/auth.service';

export default function CitizenLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError(
        t('auth.invalidEmailError', {
          defaultValue: 'Please enter a valid email address (e.g. name@domain.com).',
        })
      );
      return;
    }

    if (!password || password.trim().length === 0) {
      setError(
        t('auth.passwordRequired', {
          defaultValue: 'Please enter your account password.',
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with backend API
      const res = await authService.login({
        email: cleanEmail,
        password,
      });

      if (res && res.user) {
        localStorage.setItem('token', res.token);
        const citizenUser = { ...res.user, role: res.user.role || 'CITIZEN' };
        localStorage.setItem('user', JSON.stringify(citizenUser));
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
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: 'Citizen User',
            email: cleanEmail,
            role: 'CITIZEN',
          })
        );
        citizenService.login(cleanEmail);
      }

      router.push('/portal');
    } catch (err: any) {
      const serverMsg = err?.message || '';
      if (
        serverMsg.toLowerCase().includes('network error') ||
        serverMsg.toLowerCase().includes('timeout') ||
        serverMsg.toLowerCase().includes('econnrefused')
      ) {
        setError(
          'Unable to connect to the server. If the backend is cold-starting on Render, please wait 15–20 seconds and try again.'
        );
      } else if (serverMsg.toLowerCase().includes('verify your email')) {
        setError(serverMsg);
      } else if (serverMsg.toLowerCase().includes('inactive') || serverMsg.toLowerCase().includes('suspended')) {
        setError(serverMsg);
      } else if (serverMsg) {
        setError(serverMsg);
      } else {
        setError(
          t('auth.invalidCredentials', {
            defaultValue: 'Invalid email or password. Please verify your credentials and try again.',
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between cadastral-grid text-slate-800 selection:bg-emerald-900/15 selection:text-emerald-950">
      {/* Top Institutional Tricolor & Gov Identity */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      {/* Main Header */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-sovereign-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 flex-shrink-0 border border-emerald-700/40">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sovereign-950 tracking-tight text-lg">ILRDVS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Citizen Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Intelligent Land Record Digitization &amp; Validation System
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-5 text-sm">
            <LanguageSwitcher variant="header" />
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-sovereign-800 transition-colors py-1"
            >
              <span className="mr-1.5 text-slate-400">←</span>
              {t('common.backToHome', { defaultValue: 'Back to Home' })}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[480px]">
          {/* Elevated Sovereign Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-sovereign-950 via-sovereign-800 to-emerald-600"></div>

            <div className="p-8 sm:p-10">
              {/* Shield / Lock Badge Header */}
              <div className="flex flex-col items-center text-center mb-7">
                <div className="w-14 h-14 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100/80 mb-4 shadow-xs flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-sovereign-800" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                  Citizen Portal Login
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-sm">
                  Sign in with your registered email address and account password.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  {error.toLowerCase().includes('verify') && (
                    <div className="mt-2 pl-6">
                      <Link
                        href={`/register/citizen/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                        className="font-semibold text-emerald-800 underline hover:text-emerald-900"
                      >
                        Click here to enter your email verification OTP &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                    Email Address <span className="text-amber-600 font-bold">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-2xs">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setError(null);
                        setEmail(e.target.value);
                      }}
                      placeholder="citizen@example.com"
                      autoComplete="email"
                      className="block w-full rounded-lg border-slate-300 py-3 pl-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-shadow"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                      Password <span className="text-amber-600 font-bold">*</span>
                    </label>
                    <Link
                      href="/portal/login"
                      className="text-xs font-medium text-emerald-800 hover:text-sovereign-800 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative rounded-lg shadow-2xs">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setError(null);
                        setPassword(e.target.value);
                      }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="block w-full rounded-lg border-slate-300 py-3 pl-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-shadow tracking-widest placeholder:tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg font-semibold text-sm text-white bg-sovereign-800 hover:bg-sovereign-900 active:bg-sovereign-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sovereign-800 shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In to Citizen Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Citizen Portal Alternative Actions */}
              <div className="mt-7 text-center space-y-2 border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register/citizen"
                    className="font-semibold text-sovereign-800 hover:text-emerald-700 underline underline-offset-2 transition-colors ml-0.5"
                  >
                    Citizen Registration →
                  </Link>
                </p>
                <p className="text-xs text-slate-500">
                  Revenue Officer or Administrator?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-slate-800 hover:text-sovereign-800 underline underline-offset-2 transition-colors ml-0.5"
                  >
                    Officer Login
                  </Link>
                </p>
              </div>

              {/* Official Government Maharashtra Audit Advisory Notice */}
              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-3">
                <Lock className="w-4 h-4 text-emerald-800 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed text-slate-600 font-normal">
                  Official Government of Maharashtra portal login. All session authentication attempts are monitored and audit logged under the Information Technology Act.
                </p>
              </div>
            </div>
          </div>

          {/* Supplementary Help & Helpline Footnote */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <span>Need technical assistance?</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              <a className="text-emerald-800 font-semibold hover:underline" href="tel:18001208040">
                Toll Free: 1800-120-8040
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/70 py-6 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <span className="font-semibold text-slate-700">ILRDVS</span>
            <span className="text-slate-300">•</span>
            <span>Government of Maharashtra Revenue &amp; Forest Department</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">Land Record Governance</span>
          </div>

          <nav aria-label="Footer Security and Policy Links" className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <Link className="hover:text-sovereign-800 transition-colors" href="/#faq">
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link className="hover:text-sovereign-800 transition-colors" href="/#faq">
              Terms of Service
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">Security Audit Compliant</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
