'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Building,
  History,
  ShieldCheck,
  Compass,
  Search,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      title: 'Village Form 7/12 Extract',
      titleMr: 'गावनिहाय सातबारा',
      icon: <FileText className="w-5 h-5 text-emerald-700" />,
      desc: 'Official Record of Rights (अधिकार अभिलेख पत्रिका). Displaying survey/gat number, owner shares, cultivation entries, and encumbrance charges.',
      tag: 'Instant Digital Signature',
      fee: '₹20 (Govt)',
      href: '/land-records',
    },
    {
      id: 2,
      title: 'Urban Property Card (CTS)',
      titleMr: 'नगर भूमापन पत्रिका',
      icon: <Building className="w-5 h-5 text-amber-700" />,
      desc: 'City Survey Office (Nazul/CTS) document giving municipal limits CTS numbers, Gaothan residential titles, and carpet area demarcations.',
      tag: 'RTS Integrated',
      fee: '₹25 (Govt)',
      href: '/land-records',
    },
    {
      id: 3,
      title: 'Mutation Register (Ferfar)',
      titleMr: 'फेरफार नोंद (नमुना ६)',
      icon: <History className="w-5 h-5 text-amber-800" />,
      desc: 'Track mutation resolutions, heir-ship additions, partition decrees, and 15-day objection window progress under e-Ferfar workflow.',
      tag: 'RTS 15-Day SLA',
      fee: '₹15 (Govt)',
      href: '/verification',
    },
    {
      id: 4,
      title: 'Deed Verification & Seal',
      titleMr: 'दस्ताची पडताळणी',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      desc: 'Verify SHA-256 digital seals, SRO registered deed hashes, and Talathi cryptographic signatures on physical copies instantly via camera scan.',
      tag: 'ISO 27001 Crypt',
      fee: 'पडताळणी (Verify)',
      href: '/verification',
    },
    {
      id: 5,
      title: 'Cadastral GIS & Bhu-Naksha',
      titleMr: 'भू-नकाशा GIS',
      icon: <Compass className="w-5 h-5 text-emerald-800" />,
      desc: 'High-resolution vector maps with adjoining parcel boundaries, village roads, water canal traverses, and field boundary co-ordinates.',
      tag: 'GIS WMS Layer',
      fee: 'नकाशा पहा (Map)',
      href: '/land-records',
    },
    {
      id: 6,
      title: 'Title Search & Encumbrance',
      titleMr: 'शोध अहवाल (३० वर्षे)',
      icon: <Search className="w-5 h-5 text-amber-700" />,
      desc: '30-year automated search report indexing registered deeds, revenue court stay orders, Land Acquisition notices, and banking hypothecations.',
      tag: '30-Year History',
      fee: 'शोध अहवाल (Search)',
      href: '/land-records',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 bg-[#f7f8f4] border-b border-slate-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header with All 24 Services link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
              <span>🏛️ CITIZEN SELF-SERVICE & REVENUE SERVICES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0f2d1e] tracking-tight">
              Certified Cadastral Services & Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Acquire digitally signed, QRQC certified land records with legal status equivalent to original office copies under Section 71 of Information Technology Act and Maharashtra Land Revenue Code 1966.
            </p>
          </div>

          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-[#14532d] font-bold text-xs shadow-2xs transition-all shrink-0 self-start sm:self-auto"
          >
            <span>All 24 Citizen Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {svc.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {svc.titleMr}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#14532d] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {svc.tag}
                </span>

                <Link
                  href={svc.href}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-2xs hover:shadow transition-all"
                >
                  {svc.fee}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* RTS Guarantee Bottom Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-xs text-slate-700">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">
                Maharashtra Right to Public Services Act (RTS 2015)
              </div>
              <p className="text-xs text-slate-600">
                All 7/12, 8A extracts, and certified maps are guaranteed under service time bounds with zero physical visits required.
              </p>
            </div>
          </div>

          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-xs hover:shadow transition-all shrink-0"
          >
            <span>RTS Guarantee Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
