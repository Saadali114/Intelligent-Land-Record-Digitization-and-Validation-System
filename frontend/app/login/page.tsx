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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Top right language selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher variant="header" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-amber-400 shadow-lg mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {t('auth.officerLoginTitle')}
        </h2>
        <p className="mt-1 text-xs text-slate-600 font-medium">
          {t('auth.officerLoginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200/80 sm:rounded-2xl sm:px-10">
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
                    className="font-semibold text-blue-900 underline hover:text-blue-800"
                  >
                    Click here to enter your email verification OTP &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label={t('auth.usernameLabel')}
              type="email"
              placeholder={t('auth.usernamePlaceholder', { defaultValue: 'officer@landrecord.gov.in' })}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t('auth.passwordLabel')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full h-10 font-semibold" isLoading={isSubmitting}>
                {t('auth.loginButton')}
              </Button>
            </div>
          </form>
        </div>

        {/* Register / Account Request Box */}
        <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-600 shadow-xs flex items-center justify-between">
          <span>{t('registration.dontHaveAccount', { defaultValue: "Don't have an account?" })}</span>
          <Link href="/register" className="font-bold text-blue-900 hover:text-blue-800 underline flex items-center gap-1">
            <span>{t('registration.registerNow', { defaultValue: 'Register / Apply for Access' })}</span> &rarr;
          </Link>
        </div>

        <div className="flex items-center justify-between mt-4 px-2 text-xs">
          <Link href="/" className="font-semibold text-blue-900 hover:underline">
            &larr; {t('common.backToHome')}
          </Link>
          <Link href="/portal/login" className="font-semibold text-amber-700 hover:underline">
            {t('auth.citizenPortalLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
