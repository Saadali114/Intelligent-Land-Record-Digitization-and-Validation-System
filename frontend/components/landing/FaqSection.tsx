'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  CheckCircle2,
  Layers,
  Cpu,
  ShieldCheck,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  id: string;
  category: 'ALL' | 'LAND_STACK' | 'AI_TECH' | 'VERIFICATION' | 'LEGAL_SECURITY';
  categoryLabelKey: string;
  question: string;
  answer: string;
  highlights?: string[];
  actionLink?: {
    text: string;
    href: string;
  };
}

export const FaqSection: React.FC = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>('faq-stack-1');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tabs = [
    { key: 'ALL', label: 'All Questions', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { key: 'LAND_STACK', label: '8-Layer Land Stack & ULPIN', icon: <Layers className="w-3.5 h-3.5 text-blue-700" /> },
    { key: 'AI_TECH', label: 'AI OCR & Digitization', icon: <Cpu className="w-3.5 h-3.5 text-cyan-700" /> },
    { key: 'VERIFICATION', label: 'Verification & Mutation', icon: <FileText className="w-3.5 h-3.5 text-emerald-700" /> },
    { key: 'LEGAL_SECURITY', label: 'Anti-Fraud & Security', icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" /> },
  ];

  const faqItems: FaqItem[] = [
    {
      id: 'faq-stack-1',
      category: 'LAND_STACK',
      categoryLabelKey: '8-Layer Land Stack',
      question: 'What is the DILRMP 3.0 (2026–2031) 8-Layer Land Stack?',
      answer:
        'Under the Digital India Land Records Modernization Programme (DILRMP) 3.0 Operational Guidelines (2026–2031), the 8-Layer Land Stack is India’s unified digital geospatial framework for land governance. It unifies previously disconnected government silos into a single, cohesive multi-tier data model: (L1) WGS-84 Cadastral Vector Map, (L2) Record of Rights 7/12 & 8A Extract, (L3) NGDRS Land Registration Deeds, (L4) Land Use & Master Plan Zoning, (L5) NAKSHA Urban Property Register, (L6) RBI Unified Lending Interface Bank Liens, (L7) RCCMS Revenue Court Stay Orders, and (L8) Circle Rate Algorithmic Valuation.',
      highlights: [
        'Unifies 8 separate department databases into one parcel passport',
        'Eliminates multi-bank mortgage fraud via real-time ULI liens',
        'Automatic mutation freeze upon RCCMS court stay orders',
      ],
      actionLink: {
        text: 'Explore Interactive 8-Layer Stack',
        href: '#land-stack',
      },
    },
    {
      id: 'faq-stack-2',
      category: 'LAND_STACK',
      categoryLabelKey: 'Bhu-Aadhaar (ULPIN)',
      question: 'What is the 14-digit Bhu-Aadhaar (ULPIN) and how is it assigned?',
      answer:
        'Bhu-Aadhaar (Unique Land Parcel Identification Number - ULPIN) is a deterministic 14-character alphanumeric code (e.g. 81LVQLD9407JH0) assigned to every land parcel in India. Derived algorithmically from regional grid code, centroid latitude/longitude, and cadastral survey boundaries, it acts as a permanent, tamper-evident digital PIN connecting revenue records, registration deeds, bank mortgages, and municipal property cards.',
      highlights: [
        'Deterministic spatial derivation with zero manual human tampering',
        'Unique spatial PIN for both agricultural rural and urban properties',
        'Directly linked with masked Aadhaar seeding (XXXX-XXXX-9124) for SMS notifications',
      ],
      actionLink: {
        text: 'Search Land Records by ULPIN',
        href: '/land-records',
      },
    },
    {
      id: 'faq-ai-1',
      category: 'AI_TECH',
      categoryLabelKey: 'AI Technology',
      question: 'How does the AI OCR Pipeline recognize aged, handwritten Marathi records?',
      answer:
        'ILRDVS uses a state-of-the-art multi-stage vision pipeline: (1) Adaptive OpenCV binarization, noise filtering, and deskewing; (2) Deep Convolutional Neural Networks and Bi-LSTM vision models trained on historical cursive Devanagari script; and (3) Spatial Named Entity Recognition (NER) that transcribes owner names, survey/gat numbers, khata numbers, potkharaba land classifications, and plot areas with field-level confidence scoring.',
      highlights: [
        'Trained on extensive historical Maharashtra Modi & Devanagari archives',
        'Sub-3.2s inference SLA per archival extract scan',
        'Self-healing continuous learning feedback loop from inspector corrections',
      ],
    },
    {
      id: 'faq-verif-1',
      category: 'VERIFICATION',
      categoryLabelKey: 'Satbara (7/12)',
      question: 'What is Village Form 7/12 (Satbara Extract) and how is it used?',
      answer:
        'Village Form 7/12 (गाव नमुना ७/१२) is the statutory Record of Rights maintained under the Maharashtra Land Revenue Code 1966. Form 7 captures ownership details, survey and Gat numbers, and occupancy tenure class (Bhogwatdar Class 1 vs Class 2). Form 12 records crops grown, irrigated areas, and potkharaba (uncultivable land). It is the mandatory title document required for land sales, bank agricultural loans, and succession claims.',
      actionLink: {
        text: 'Search Certified 7/12 Extracts',
        href: '/land-records',
      },
    },
    {
      id: 'faq-verif-2',
      category: 'VERIFICATION',
      categoryLabelKey: 'Mutation (Form 6)',
      question: 'What is Form 6 Mutation (Ferfar) and what is the clearance SLA?',
      answer:
        'Form 6 Mutation Register (फेरफार नोंदवही) records every legal title modification—including sale conveyance, inheritance (वारस नोंद), partition, or bank mortgage release. Under the Right to Services (RTS) Act, uncontested mutations are mandated to be reviewed and sanctioned within 15 working days by the local Talathi and Circle Officer.',
      highlights: [
        'Online Form 6 tracking from citizen portal',
        'Mandatory 15-day statutory clearance SLA',
        'Instantaneous triggering upon NGDRS sale deed registration',
      ],
    },
    {
      id: 'faq-verif-3',
      category: 'VERIFICATION',
      categoryLabelKey: 'Urban Property Card',
      question: 'What is the difference between rural 7/12 Satbara and urban Property Cards?',
      answer:
        'Village Form 7/12 applies to revenue villages and agricultural land. Urban Property Cards (नगर भूमापन मिळकत पत्रिका) are maintained by the City Survey Office (CTSO) under the NAKSHA Urban Property Register framework for municipal areas. They reference City Survey (CTS) numbers, carpet plot area, permissible Floor Space Index (FSI), and municipal assessment details.',
      actionLink: {
        text: 'Explore Cadastral Services',
        href: '#services',
      },
    },
    {
      id: 'faq-sec-1',
      category: 'LEGAL_SECURITY',
      categoryLabelKey: 'Security & Anti-Fraud',
      question: 'How does ILRDVS prevent fraudulent double registration and distress sales?',
      answer:
        'Every parcel is cross-verified across 3 real-time gateways: (1) Reserve Bank of India Unified Lending Interface (ULI) prevents multi-bank hypothecation; (2) Revenue Court Case Management System (RCCMS) automatically freezes mutations if a court stay order exists; and (3) Algorithmic Circle Rate valuation prevents under-declaration of property values.',
      highlights: [
        'SHA-256 cryptographic audit hash on all certified digital certificates',
        'Real-time RBI lending lien lock',
        'Automatic stay order flags prevent illegal conveyance of contested parcels',
      ],
      actionLink: {
        text: 'Launch Verification Workstation',
        href: '/verification',
      },
    },
    {
      id: 'faq-sec-2',
      category: 'LEGAL_SECURITY',
      categoryLabelKey: 'Grievance Redressal',
      question: 'How do I report typographical discrepancies or boundary errors in my record?',
      answer:
        'Citizens can file an online grievance via our Citizen Corner or Contact section below. Revenue inspectors examine the original physical cadastral sheets and Electronic Total Station (ETS) survey coordinates in the split-screen Verification Workstation, rectify verified discrepancies, and reissue a certified extract with an auditable change log.',
      actionLink: {
        text: 'Submit Online Grievance',
        href: '#contact',
      },
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesTab = activeTab === 'ALL' || item.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabelKey.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-bold text-blue-900 uppercase tracking-wider shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-blue-800" />
            <span>Citizen Knowledge Base & FAQ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Find answers regarding the 8-Layer Land Stack, Bhu-Aadhaar (ULPIN), 7/12 Satbara extracts, Form 6 mutations, and AI cadastral verification.
          </p>
        </div>

        {/* Search Bar & Category Filter Tabs */}
        <div className="space-y-4">
          {/* Quick Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g., 8-layer stack, Bhu-Aadhaar, mutation, OCR, dispute)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-950 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">No matching questions found</p>
              <p className="text-xs text-slate-500">
                Try searching for keywords like "Satbara", "Bhu-Aadhaar", "Land Stack", or "Mutation".
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden ${
                    isOpen ? 'border-blue-900 shadow-md ring-1 ring-blue-900/10' : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/70"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {faq.categoryLabelKey}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-900' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 space-y-4 animate-in fade-in-50 duration-200">
                      <p>{faq.answer}</p>

                      {/* Key Takeaway Bullets if available */}
                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Key Governance Provisions:</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {faq.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-900 font-bold">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action CTA Link if available */}
                      {faq.actionLink && (
                        <div className="pt-1">
                          <Link
                            href={faq.actionLink.href}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline"
                          >
                            <span>{faq.actionLink.text}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions? Helpdesk Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-sm">Still have questions regarding your land parcel?</h4>
            <p className="text-xs text-slate-600">
              Our 24x7 citizen helpdesk and regional taluka revenue inspectors are available to assist.
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <span>Contact Helpdesk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
