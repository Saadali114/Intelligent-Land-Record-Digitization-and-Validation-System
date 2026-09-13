'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getLoginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { Building2, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginSchema = useMemo(() => getLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('network error') ||
        msg.toLowerCase().includes('timeout') ||
        msg.toLowerCase().includes('econnrefused')
      ) {
        setErrorMessage(
          'Unable to connect to the backend server. If the server is waking up (Render free tier cold start), please wait 15–20 seconds and try again.'
        );
      } else {
        setErrorMessage(
          msg ||
            t('auth.invalidCredentials', {
              defaultValue: 'Invalid credentials. Please verify your email and password.',
            })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-between cadastral-grid text-slate-800 antialiased selection:bg-emerald-900/15 selection:text-emerald-950">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      {/* Top Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-sovereign-950 text-amber-400 flex items-center justify-center shadow-xs border border-sovereign-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700">
                  Government of India / State Revenue
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[11px] text-slate-500 font-medium">Digital Cadastre Wing</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                ILRDVS <span className="font-normal text-slate-500 hidden sm:inline">| Intelligent Land Record Digitization &amp; Validation</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher variant="header" />
            <div className="hidden sm:flex items-center text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Officer Portal v2.4
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Badge Icon atop Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sovereign-950 text-amber-400 p-3 shadow-md border-2 border-sovereign-800 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t('auth.officerLoginTitle', { defaultValue: 'Department Officer Login' })}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm">
              {t('auth.officerLoginSubtitle', {
                defaultValue: 'Authorized access for Talathis, Circle Officers, Tahsildars, and Settlement Commissioners.',
              })}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden relative p-6 sm:p-8">
            <div className="h-1.5 w-full bg-gradient-to-r from-sovereign-950 via-sovereign-800 to-amber-600 absolute top-0 left-0 right-0"></div>

            {errorMessage && (
              <div className="mb-5 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
                {errorMessage.toLowerCase().includes('verify') && (
                  <div className="mt-2 pl-6">
                    <Link
                      href={`/register/officer/verify-email?email=${encodeURIComponent(watch('email') || '')}`}
                      className="font-semibold text-emerald-800 underline hover:text-emerald-900"
                    >
                      Click here to enter your email verification OTP &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label={t('auth.usernameLabel', { defaultValue: 'Official Email or Employee ID' })}
                type="email"
                placeholder="officer@landrecord.gov.in"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label={t('auth.passwordLabel', { defaultValue: 'Password' })}
                type="password"
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg font-semibold text-sm text-white bg-sovereign-800 hover:bg-sovereign-900 active:bg-sovereign-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sovereign-800 shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Authenticating...' : t('auth.loginButton', { defaultValue: 'Sign In to Officer Console' })}</span>
                  <span>→</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{t('registration.dontHaveAccount', { defaultValue: "Don't have an account?" })}</span>
              <Link
                href="/register/officer"
                className="font-bold text-sovereign-800 hover:text-emerald-700 underline"
              >
                Officer Access Application &rarr;
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 px-2 text-xs">
            <Link href="/" className="font-semibold text-slate-600 hover:text-sovereign-800">
              &larr; {t('common.backToHome', { defaultValue: 'Back to Home' })}
            </Link>
            <Link href="/portal/login" className="font-semibold text-emerald-800 hover:underline">
              {t('auth.citizenPortalLink', { defaultValue: 'Citizen Portal Login →' })}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/70 py-4 text-slate-600 text-xs text-center">
        <span>ILRDVS — Official Revenue Administration Gateway • Department of Land Records</span>
      </footer>
    </div>
  );
}
