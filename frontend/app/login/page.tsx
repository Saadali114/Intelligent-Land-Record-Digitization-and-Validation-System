'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, Shield, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'admin@landrecord.gov.in',
      password: 'Password123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await login(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (roleEmail: string) => {
    setValue('email', roleEmail);
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-amber-400 shadow-lg mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Land Records Official Portal
        </h2>
        <p className="mt-1 text-xs text-slate-600 font-medium">
          Digital Land Record Digitization & Validation System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200/80 sm:rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Official Email Address"
              type="email"
              placeholder="officer@landrecord.gov.in"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Secure Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full h-10 font-semibold" isLoading={isSubmitting}>
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Account Quick Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@landrecord.gov.in')}
                className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">Admin</div>
                <div className="text-slate-500 text-[10px]">Super administrator</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('officer1@landrecord.gov.in')}
                className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">Officer</div>
                <div className="text-slate-500 text-[10px]">Upload & record entry</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('verifier1@landrecord.gov.in')}
                className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">Verifier</div>
                <div className="text-slate-500 text-[10px]">Review & approval</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('viewer1@landrecord.gov.in')}
                className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">Viewer</div>
                <div className="text-slate-500 text-[10px]">Read-only access</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Standard seed password: <span className="font-mono text-slate-600 font-semibold">Password123!</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs font-semibold text-blue-900 hover:underline">
            &larr; Return to Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
}
