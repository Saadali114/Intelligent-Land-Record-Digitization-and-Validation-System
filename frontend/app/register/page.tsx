'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

export default function RegisterLandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-blue-900 font-semibold">{t('registration.registrationHeader', { defaultValue: 'Registration Portal' })}</span>
              </div>
              <div className="text-xs text-slate-500">
                {t('common.portalFullName', { defaultValue: 'Intelligent Land Record Digitization & Validation System' })}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="header" />
            <Link
              href="/login"
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline hidden sm:block"
            >
              {t('common.alreadyRegistered', { defaultValue: 'Already registered? Sign in →' })}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('registration.portalBadge', { defaultValue: 'Official Access Registration' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('registration.title', { defaultValue: 'Create Your ILRDVS Account' })}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {t('registration.subtitle', {
              defaultValue:
                'Select your account pathway to access land digitization, document verification, or official review workspaces.',
            })}
          </p>
        </div>

        {/* 2 Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
          {/* Card 1: Citizen */}
          <div className="bg-white border-2 border-slate-200 hover:border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {t('registration.citizenBadge', { defaultValue: 'Self-Service' })}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                {t('registration.citizenTitle', { defaultValue: 'Citizen Portal' })}
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                {t('registration.citizenDesc', {
                  defaultValue: 'For citizens, landholders, and legal heirs to submit and track records.',
                })}
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('registration.citizenBenefit1', { defaultValue: 'Submit scanned 7/12 & Mutation documents' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('registration.citizenBenefit2', { defaultValue: 'Review AI OCR transcription & verify data' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('registration.citizenBenefit3', { defaultValue: 'Real-time application status tracking' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('registration.citizenBenefit4', { defaultValue: 'Direct email OTP verification (Instant Access)' })}</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register/citizen"
                className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs group-hover:shadow"
              >
                <span>{t('registration.registerAsCitizen', { defaultValue: 'Register as Citizen' })}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="text-[11px] text-slate-400 text-center mt-2.5">
                {t('registration.citizenActivationNote', {
                  defaultValue: 'Account activates instantly after 6-digit email OTP verification.',
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Officer */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {t('registration.officerBadge', { defaultValue: 'Regulated Access' })}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                {t('registration.officerTitle', { defaultValue: 'Revenue Officer Portal' })}
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                {t('registration.officerDesc', {
                  defaultValue: 'For authorized Talathis, Circle Officers, and Tahsildars conducting official reviews.',
                })}
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('registration.officerBenefit1', { defaultValue: 'Dual-pane 4-pillar verification workspace' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('registration.officerBenefit2', { defaultValue: 'Official cadastral comparison & discrepancy analysis' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('registration.officerBenefit3', { defaultValue: 'Statutory approval, clarification, and reject actions' })}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-900 font-medium">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('registration.officerBenefit4', { defaultValue: 'Requires Official ID & Admin Approval' })}</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register/officer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs group-hover:shadow"
              >
                <span>{t('registration.applyForOfficer', { defaultValue: 'Apply for Officer Access' })}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="text-[11px] text-amber-700 font-medium text-center mt-2.5">
                {t('registration.officerApprovalNotice', {
                  defaultValue: 'Officer access requires administrative review and statutory verification.',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Disclaimer Footer */}
        <div className="max-w-2xl mx-auto mt-10 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            {t('registration.securityNotice', {
              defaultValue:
                'All registrations use 256-bit cryptographic verification. Admin accounts cannot be registered publicly.',
            })}
          </span>
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
