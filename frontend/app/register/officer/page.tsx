'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Shield,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  AlertCircle,
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { authService } from '../../../services/auth.service';

export default function OfficerRegisterPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredLanguage: i18n.language || 'en',
    employeeId: '',
    department: 'Revenue Department',
    designation: 'Revenue Officer',
    office: '',
    district: 'Pune',
    taluka: '',
    password: '',
    confirmPassword: '',
    confirmOfficerApplication: false,
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
      setError(t('registration.invalidEmail', { defaultValue: 'Please provide a valid official email address.' }));
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.employeeId.trim()) {
      setError(t('registration.employeeIdRequired', { defaultValue: 'Officer / Employee ID is required.' }));
      return;
    }
    if (!formData.office.trim()) {
      setError(t('registration.officeRequired', { defaultValue: 'Office name is required.' }));
      return;
    }
    setStep(3);
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
    if (!formData.confirmOfficerApplication) {
      setError(
        t('registration.confirmOfficerRequired', {
          defaultValue: 'You must confirm that your officer information is accurate for authorized access.',
        })
      );
      return;
    }
    if (!formData.acceptTerms) {
      setError(t('registration.termsRequired', { defaultValue: 'You must agree to the Terms of Service to continue.' }));
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerOfficer({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        employeeId: formData.employeeId.trim(),
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        office: formData.office.trim(),
        district: formData.district.trim(),
        taluka: formData.taluka.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        preferredLanguage: formData.preferredLanguage,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: true,
        confirmOfficerApplication: true,
      });

      router.push(`/register/officer/verify-email?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
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
            <div className="w-10 h-10 rounded-lg bg-amber-800 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-amber-800 font-semibold">{t('registration.officerPortal', { defaultValue: 'Revenue Officer Portal' })}</span>
              </div>
              <div className="text-xs text-slate-500">{t('registration.officerApplicationHeader', { defaultValue: 'Regulated Access Application' })}</div>
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

      {/* Main Form Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('registration.officerApprovalNotice', { defaultValue: 'Administrative Review Required' })}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('registration.officerFormTitle', { defaultValue: 'Revenue Officer Access Application' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('registration.officerFormSubtitle', {
                defaultValue:
                  'Apply for authorized officer access to review 7/12 land records, mutations, and cadastral dossiers.',
              })}
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                step === 1 ? 'bg-amber-800 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span>1</span>
              <span>{t('registration.stepPersonal', { defaultValue: 'Personal' })}</span>
            </div>
            <div className="w-4 h-0.5 bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                step === 2
                  ? 'bg-amber-800 text-white'
                  : step > 2
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>2</span>
              <span>{t('registration.stepOfficial', { defaultValue: 'Official' })}</span>
            </div>
            <div className="w-4 h-0.5 bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                step === 3 ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>3</span>
              <span>{t('registration.stepSecurity', { defaultValue: 'Security' })}</span>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Personal Info */}
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
                    placeholder={t('registration.officerNamePlaceholder', { defaultValue: 'e.g. Smt. Priya Ramesh Deshmukh' })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('registration.officialEmail', { defaultValue: 'Official Organization Email' })} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('registration.officerEmailPlaceholder', { defaultValue: 'priya.deshmukh@maharashtra.gov.in' })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('registration.officialEmailHelp', {
                    defaultValue: 'A 6-digit email verification code will be dispatched to this inbox before admin review.',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.phoneOptional', { defaultValue: 'Contact Phone (Optional)' })}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder={t('registration.phonePlaceholder', { defaultValue: '9822012345' })}
                      maxLength={10}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors font-mono"
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
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
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
                className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{t('registration.continueOfficialInfo', { defaultValue: 'Continue to Official Information' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Official Info */}
          {step === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.employeeId', { defaultValue: 'Employee / Officer ID' })} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                      placeholder={t('registration.employeeIdPlaceholder', { defaultValue: 'e.g. REV-MH-2026-489' })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors font-mono"
                    />
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.designation', { defaultValue: 'Official Designation' })} *
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  >
                    <option value="Revenue Officer">{t('registration.designations.revenueOfficer', { defaultValue: 'Revenue Officer' })}</option>
                    <option value="Circle Officer">{t('registration.designations.circleOfficer', { defaultValue: 'Circle Officer' })}</option>
                    <option value="Talathi (Village Accountant)">{t('registration.designations.talathi', { defaultValue: 'Talathi (Village Accountant)' })}</option>
                    <option value="Tahsildar / Naib Tahsildar">{t('registration.designations.tahsildar', { defaultValue: 'Tahsildar / Naib Tahsildar' })}</option>
                    <option value="Inspector of Land Records">{t('registration.designations.inspectorOfLandRecords', { defaultValue: 'Inspector of Land Records' })}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.department', { defaultValue: 'Department' })} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder={t('registration.departmentPlaceholder', { defaultValue: 'Revenue & Forest Department' })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.officeName', { defaultValue: 'Office / Posting Name' })} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    placeholder={t('registration.officePlaceholder', { defaultValue: 'e.g. Haveli Tahsil Office, Pune' })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.district', { defaultValue: 'District' })} *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                    >
                      <option value="Pune">{t('districts.pune', { defaultValue: 'Pune' })}</option>
                      <option value="Nashik">{t('districts.nashik', { defaultValue: 'Nashik' })}</option>
                      <option value="Nagpur">{t('districts.nagpur', { defaultValue: 'Nagpur' })}</option>
                      <option value="Mumbai City">{t('districts.mumbaiCity', { defaultValue: 'Mumbai City' })}</option>
                      <option value="Mumbai Suburban">{t('districts.mumbaiSuburban', { defaultValue: 'Mumbai Suburban' })}</option>
                      <option value="Thane">{t('districts.thane', { defaultValue: 'Thane' })}</option>
                      <option value="Aurangabad">{t('districts.chhatrapatiSambhajinagar', { defaultValue: 'Chhatrapati Sambhajinagar (Aurangabad)' })}</option>
                      <option value="Kolhapur">{t('districts.kolhapur', { defaultValue: 'Kolhapur' })}</option>
                    </select>
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('registration.talukaOptional', { defaultValue: 'Taluka (Optional)' })}
                  </label>
                  <input
                    type="text"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    placeholder={t('registration.talukaPlaceholder', { defaultValue: 'e.g. Haveli' })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors"
                  />
                </div>
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
                  className="w-2/3 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t('registration.continueCredentials', { defaultValue: 'Continue to Security Setup' })}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Credentials & Statutory Terms */}
          {step === 3 && (
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
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors font-mono"
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
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Statutory Confirmation Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmOfficerApplication}
                    onChange={(e) => setFormData({ ...formData, confirmOfficerApplication: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-800 focus:ring-amber-800 border-amber-300 mt-0.5"
                  />
                  <span className="text-xs text-amber-900 font-medium">
                    {t('registration.confirmOfficerDeclaration', {
                      defaultValue:
                        'I declare that the information provided is true and accurate, and that I am applying for authorized revenue officer review access.',
                    })}
                  </span>
                </label>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-800 focus:ring-amber-800 border-slate-300 mt-0.5"
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
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back', { defaultValue: 'Back' })}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>{t('registration.submittingApplication', { defaultValue: 'Submitting Application...' })}</span>
                  ) : (
                    <>
                      <span>{t('registration.submitOfficerApplication', { defaultValue: 'Submit & Verify Official Email' })}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Legal Footer Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            {t('registration.officerLegalNotice', {
              defaultValue:
                'Officer accounts require explicit administrative verification before access to cadastral review tools is enabled.',
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
