'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
  Lock,
  Layers,
  Sparkles,
  PhoneCall,
  FileCheck2,
  Database,
  Eye,
  Check,
} from 'lucide-react';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

export default function RegisterLandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Top Accessibility & Gov Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 sm:px-8 py-1.5 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🏛️ भारत सरकार</span>
            <span className="text-slate-600">|</span>
            <span className="font-medium">Government of Maharashtra &bull; Revenue Directorate</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted Portal
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs border border-blue-800 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>ILRDVS</span>
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {t('registration.registrationHeader', { defaultValue: 'Registration Portal' })}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 hidden sm:block truncate max-w-[340px] md:max-w-none">
                {t('common.portalFullName', { defaultValue: 'Intelligent Land Record Digitization & Validation System' })}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher variant="header" />
            <Link
              href="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-900 text-blue-950 hover:bg-slate-100 transition-colors"
            >
              {t('common.alreadyRegistered', { defaultValue: 'Sign in →' })}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-10">
        {/* Back navigation & Page Title */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-blue-800" />
              <span>DILRMP 3.0 Citizen & Officer Access Onboarding</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Create Your ILRDVS Account
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Select your registration pathway to access the Unified 8-Layer Land Stack, 14-digit Bhu-Aadhaar (ULPIN) parcel passport, automated Form 6 mutations, or statutory verification workstations.
            </p>
          </div>
        </div>

        {/* 2 Split Cards: Citizen vs Officer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto w-full items-stretch">
          {/* Card 1: Citizen Self-Service */}
          <div className="bg-white border-2 border-slate-200 hover:border-blue-900 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-amber-400 transition-colors shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Instant Citizen Access</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-950 transition-colors">
                  Citizen Portal Registration
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For landowners, agricultural khatedars, prospective buyers, legal heirs, and citizens across Maharashtra.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Unified 8-Layer Access:</strong> Search certified 7/12 Satbara, 8A Khata, and NAKSHA urban property cards anchored to 14-digit Bhu-Aadhaar.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Digitize Scanned Extracts:</strong> Upload archival paper documents for automated AI OCR Devanagari & Modi script transcription.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Form 6 Mutation Tracking:</strong> Submit mutation requests (sale, inheritance, partition) and monitor statutory 15-day RTS clearance.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Online Grievance Redressal:</strong> Report boundary errors, potkharaba discrepancies, and track resolution timelines.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
              <Link
                href="/register/citizen"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-blue-900/20 text-center"
              >
                <span>Register as Citizen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
              </Link>
              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant activation via 6-digit email OTP verification</span>
              </div>
            </div>
          </div>

          {/* Card 2: Revenue Officer Portal */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-600 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-white transition-colors shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Official Regulated Access</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-950 transition-colors">
                  Revenue Officer Application
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For designated Talathis, Circle Officers, Tahsildars, CTSO Inspectors, and Settlement Commissioners.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Split-Screen Verification Workstation:</strong> Side-by-side comparison of scanned cadastral maps and AI OCR extractions with confidence scoring.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Statutory Mutation Governance:</strong> Review Form 6 Ferfar notices, record public objections, and approve title modifications.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Triple Anti-Fraud Gateways:</strong> Real-time cross-validation with Reserve Bank ULI bank liens and RCCMS court injunction flags.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cryptographic Registry Seals:</strong> Issue SHA-256 certified digital 7/12 extracts with tamper-evident QR verification codes.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
              <Link
                href="/register/officer"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-slate-900/20 text-center"
              >
                <span>Apply for Officer Access</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
              </Link>
              <div className="text-[11px] text-amber-800 font-semibold text-center flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Requires official employee ID & administrative approval</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Mini Matrix */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Layers className="w-4 h-4 text-blue-900" />
            <span>Which Account Pathway is Right for You?</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">Portal Capability</th>
                  <th className="py-2.5 px-3 text-blue-900">Citizen Self-Service</th>
                  <th className="py-2.5 px-3 text-amber-900">Revenue Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">14-Digit Bhu-Aadhaar Parcel Search</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Scanned Document OCR Upload</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Form 6 Mutation Application</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Apply & Track</td>
                  <td className="py-2.5 px-3 text-amber-800 font-bold">✓ Sanction & Authorize</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Inspector Verification Workstation</td>
                  <td className="py-2.5 px-3 text-slate-400">View Certified Extracts</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Full Split-Screen Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Approval Requirement</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">Instant (Email OTP)</td>
                  <td className="py-2.5 px-3 text-amber-800 font-bold">State Admin Review Required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security, Trust & Helpdesk Strip */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs text-slate-600">
              <div className="font-bold text-slate-900">Official Government Registration Protocol</div>
              <p>All data is encrypted with 256-bit AES cryptographic protocols under DILRMP standards.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 shrink-0">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>Toll-Free Helpdesk: 1800-233-4567</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {t('common.portalGovNotice', {
              defaultValue: 'ILRDVS — Government of Maharashtra Revenue & Forest Department Land Governance Portal',
            })}
          </span>
          <span className="font-medium text-slate-400">DILRMP 3.0 Standard Compliant</span>
        </div>
      </footer>
    </div>
  );
}
