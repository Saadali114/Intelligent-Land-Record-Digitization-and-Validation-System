'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      icon: '📄',
      iconBg: 'bg-emerald-50 text-emerald-700',
      tag: 'Instant Digital Copy',
      tagColor: 'bg-emerald-100 text-emerald-800',
      title: 'Village Form 7/12 (Satbara Extract)',
      marathi: 'गाव नमुना ७/१२ अधिकार अभिलेख',
      desc: 'Digitized records of rights, potkharaba and classification, occupant dues, and agricultural assessment with official seals.',
      linkText: 'Search 7/12 Record',
      href: '/land-records',
    },
    {
      id: 2,
      icon: '🏢',
      iconBg: 'bg-gold-50 text-gold-600',
      tag: 'City Survey CTS',
      tagColor: 'bg-gold-100 text-gold-800',
      title: 'Urban Property Card (Milkat Patra)',
      marathi: 'नगर भूमापन मिळकत पत्रिका (CTS)',
      desc: 'Authentic municipal and city survey registry records detailing carpet area, port-boundaries, and freehold tenure for urban parcels.',
      linkText: 'View Property Cards',
      href: '/land-records',
    },
    {
      id: 3,
      icon: '📜',
      iconBg: 'bg-amber-50 text-amber-700',
      tag: 'Real-time Tracking',
      tagColor: 'bg-amber-100 text-amber-800',
      title: 'Mutation Services (Form 6 Ferfar)',
      marathi: 'गाव नमुना ६ फेरफार नोंदवही',
      desc: 'End-to-end processing and tracking of inheritance, sale conveyance, gift deed, and partition transfers sanctioned by Circle Officers.',
      linkText: 'Track Ferfar Status',
      href: '/verification',
    },
    {
      id: 4,
      icon: '🔍',
      iconBg: 'bg-blue-50 text-blue-700',
      tag: 'Inspector Workstation',
      tagColor: 'bg-blue-100 text-blue-800',
      title: 'Document Authenticity & Verification',
      marathi: 'दस्त नोंदणी व सत्यता पडताळणी',
      desc: 'AI-driven dual-pane verification workstation enabling inspectors to compare physical archival scans directly with digital extractions.',
      linkText: 'Launch Workstation',
      href: '/verification',
    },
    {
      id: 5,
      icon: '🗺️',
      iconBg: 'bg-emerald-50 text-emerald-700',
      tag: '8-Layer Land Stack',
      tagColor: 'bg-emerald-100 text-emerald-800',
      title: '8-Layer Land Stack & Cadastral GIS',
      marathi: '८-स्तरीय भूमी स्टॅक व भूमापन नकाशा',
      desc: 'Multi-registry spatial parcel stack linking WGS-84 vector boundaries, 14-digit Bhu-Aadhaar ULPIN, bank liens, and RCCMS stay orders.',
      linkText: 'Explore 8-Layer Stack',
      href: '#stack',
    },
    {
      id: 6,
      icon: '⚖️',
      iconBg: 'bg-stone-100 text-stone-700',
      tag: 'Public Title Search',
      tagColor: 'bg-stone-200 text-stone-800',
      title: 'Online Title Search & Encumbrance',
      marathi: 'ऑनलाइन दस्त शोध व बोजा पडताळणी',
      desc: 'Check bank mortgages, court litigation injunctions, and prior legal liabilities registered against any survey or Gat number.',
      linkText: 'Search Document Registry',
      href: '/land-records',
    },
  ];

  return (
    <section
      id="services"
      data-purpose="government-services-cards"
      className="py-16 px-4 sm:px-8 max-w-7xl mx-auto bg-white select-none"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-1 bg-emerald-100 text-sovereign-800 font-mono text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-2 border border-emerald-200">
          <span>🏛️</span>
          <span>SERVICES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          Government Land Record Services
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-2">
          Access certified land ownership extracts, submit mutation notices, and verify digital signatures online.
        </p>
      </div>

      {/* 6 Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <article
            key={service.id}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`w-9 h-9 rounded flex items-center justify-center font-bold text-base ${service.iconBg}`}
                >
                  {service.icon}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${service.tagColor}`}
                >
                  {service.tag}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                {service.title}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium mb-2">
                {service.marathi}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {service.desc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-200">
              <Link
                href={service.href}
                className="text-xs font-semibold text-sovereign-800 hover:text-gold-600 flex items-center space-x-1 transition-colors"
              >
                <span>{service.linkText}</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
