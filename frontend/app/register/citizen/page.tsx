'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  AlertCircle,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { authService } from '../../../services/auth.service';

export default function CitizenRegisterPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredLanguage: i18n.language || 'en',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: t('registration.strengthNone', { defaultValue: 'None' }), color: 'bg-slate-200' };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[@$!%*?&]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: t('registration.strengthWeak', { defaultValue: 'Weak' }), color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: t('registration.strengthFair', { defaultValue: 'Fair' }), color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: t('registration.strengthGood', { defaultValue: 'Good' }), color: 'bg-blue-600' };
    return { score: 4, label: t('registration.strengthStrong', { defaultValue: 'Strong' }), color: 'bg-emerald-600' };
  }, [formData.password, t]);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError(t('registration.nameRequired', { defaultValue: 'Full name is required (min 2 characters).' }));
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError(t('registration.invalidEmail', { defaultValue: 'Please provide a valid email address.' }));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError(t('registration.passwordMinLength', { defaultValue: 'Password must be at least 8 characters long.' }));
      return;
    }
    if (passwordStrength.score < 3) {
      setError(
        t('registration.passwordRequirements', {
          defaultValue: 'Password must contain uppercase, lowercase, numbers, and a special character.',
        })
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('registration.passwordMismatch', { defaultValue: 'Passwords do not match.' }));
      return;
    }
    if (!formData.acceptTerms) {
      setError(t('registration.termsRequired', { defaultValue: 'You must agree to the Terms of Service to continue.' }));
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerCitizen({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        preferredLanguage: formData.preferredLanguage,
        phone: formData.phone.trim() || undefined,
        acceptTerms: true,
      });

      // Navigate to verification screen
      router.push(`/register/citizen/verify-email?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
    } catch (err: any) {
      setError(err.message || t('registration.failed', { defaultValue: 'Registration failed. Please try again.' }));
    } finally {
      setIsLoading(false);
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
              <div className="text-xs text-slate-500">{t('registration.newCitizenRegistration', { defaultValue: 'New Citizen Registration' })}</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="header" />
            <Link
              href="/register"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block"
            >
              ← {t('registration.changeRole', { defaultValue: 'Change Account Type' })}
            </Link>
          </div>
        </div>
      </header>

      {/* Center Registration Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('registration.citizenFormTitle', { defaultValue: 'Citizen Account Registration' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('registration.citizenFormSubtitle', {
                defaultValue: 'Create an account to submit 7/12 land records and track AI verification.',
              })}
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                step === 1
                  ? 'bg-blue-900 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span>1</span>
              <span>{t('registration.step1', { defaultValue: 'Basic Info' })}</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                step === 2
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>2</span>
              <span>{t('registration.step2', { defaultValue: 'Security' })}</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400">
              <span>3</span>
              <span>{t('registration.step3', { defaultValue: 'Verify' })}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 Form */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('registration.fullName', { defaultValue: 'Full Name' })} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('registration.namePlaceholderCitizen', { defaultValue: 'e.g. Shankar Ganpat Patil' })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('registration.email', { defaultValue: 'Email Address' })} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('registration.emailPlaceholderCitizen', { defaultValue: 'citizen@example.com' })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('registration.emailNotice', {
                    defaultValue: 'A real 6-digit email OTP verification code will be sent to this inbox.',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.phoneOptional', { defaultValue: 'Phone Number (Optional)' })}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder={t('registration.phonePlaceholder', { defaultValue: '9822012345' })}
                      maxLength={10}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.preferredLanguage', { defaultValue: 'Preferred Language' })}
                  </label>
                  <div className="relative">
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                    </select>
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{t('registration.continueCredentials', { defaultValue: 'Continue to Security Setup' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2 Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('registration.password', { defaultValue: 'Account Password' })} *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{t('registration.strength', { defaultValue: 'Password strength' })}:</span>
                      <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '25%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '25%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '25%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '25%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('registration.confirmPassword', { defaultValue: 'Confirm Password' })} *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900 border-slate-300 mt-0.5"
                  />
                  <span className="text-xs text-slate-600">
                    {t('registration.agreeTermsText', {
                      defaultValue: 'I agree to the Terms of Service, Privacy Policy, and Prototype Data Processing Terms.',
                    })}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back', { defaultValue: 'Back' })}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>{t('registration.creatingAccount', { defaultValue: 'Creating Account...' })}</span>
                  ) : (
                    <>
                      <span>{t('registration.submitAndSendOtp', { defaultValue: 'Submit & Send Email OTP' })}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Legal Footer Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            {t('registration.citizenLegalNotice', {
              defaultValue:
                'Citizen registration creates an account for digital document submissions. It does not confer title or ownership to land records without official revenue verification.',
            })}
          </div>
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
