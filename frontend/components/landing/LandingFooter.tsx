'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Award, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0f2d1e] text-slate-200 text-xs select-none border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-500/50 flex items-center justify-center text-amber-300 font-bold shadow-xs">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight">
                  ILRDVS महाराष्ट्र
                </span>
                <p className="text-[10px] text-emerald-300 font-bold tracking-wide uppercase">
                  Government of Maharashtra
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed max-w-md">
              Integrated Land Record Digitization & Validation System under the aegis of Revenue & Forest Department, Government of Maharashtra and Digital India Land Records Modernization Programme (DILRMP 3.0).
            </p>

            {/* Compliance Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                STQC Certified ISO/IEC
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ISO 27001 Secured
              </span>
            </div>
          </div>

          {/* 3 Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Column 1: USER PORTALS */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                USER PORTALS (वापर प्रणाली)
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li>
                  <Link href="/land-records" className="hover:text-emerald-300 transition-colors">
                    Mahabhumi 7/12 & 8A
                  </Link>
                </li>
                <li>
                  <Link href="/land-records" className="hover:text-emerald-300 transition-colors">
                    Bhu-Naksha Cadastral Maps
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="hover:text-emerald-300 transition-colors">
                    e-Haqq Mutation Filing
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-emerald-300 transition-colors">
                    e-Ferfar Validative Engine
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="hover:text-emerald-300 transition-colors">
                    Mahakosh & GRAS Integration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: CORE ARCHITECTURE */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                CORE ARCHITECTURE
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li>
                  <Link href="#land-stack" className="hover:text-emerald-300 transition-colors">
                    Cadastral AI Boundary Matcher
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-emerald-300 transition-colors">
                    Archaic Modi Script Neural OCR
                  </Link>
                </li>
                <li>
                  <Link href="#land-stack" className="hover:text-emerald-300 transition-colors">
                    8-Layer Cadastral Verification Stack
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-emerald-300 transition-colors">
                    DILRMP 3.0 Interoperability API
                  </Link>
                </li>
                <li>
                  <Link href="/land-records" className="hover:text-emerald-300 transition-colors">
                    ULPIN Geo-Reference Index
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: CITIZEN GOVERNANCE */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                CITIZEN GOVERNANCE
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li>
                  <Link href="/portal" className="hover:text-emerald-300 transition-colors">
                    Citizens Self-Service Hub
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="hover:text-emerald-300 transition-colors">
                    Right to Services (RTS) Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/land-records" className="hover:text-emerald-300 transition-colors">
                    Maharashtra Land Revenue Code
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="hover:text-emerald-300 transition-colors">
                    Dispute Redressal & Lokayukta
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="hover:text-emerald-300 transition-colors">
                    Standard Operating Procedures
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
          <p>
            Designed and developed for Revenue & Forest Department, Mantralaya, Mumbai 400032.
          </p>
          <div className="flex items-center gap-3">
            <span>© 2024 ILRDVS Maharashtra</span>
            <span>•</span>
            <Link href="#" className="hover:text-emerald-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-emerald-300">Terms of Service</Link>
            <span>•</span>
            <Link href="#" className="hover:text-emerald-300">Hyperlinking Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
