import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Building2,
  FileCheck2,
  Sparkles,
  Search,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServiceItem {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  link: string;
  actionText: string;
}

export const ServicesSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const services: ServiceItem[] = [
    {
      id: 'satbara',
      title: 'Village Form 7/12 (Satbara Extract)',
      titleMr: 'गाव नमुना ७/१२ अधिकार अभिलेख',
      description:
        'Digitized records of rights, potkharaba land classification, occupant class, and agricultural land assessment with official seals.',
      icon: <FileText className="w-6 h-6 text-blue-700" />,
      badge: 'Instant Digital Copy',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      link: '/land-records',
      actionText: 'Search 7/12 Record',
    },
    {
      id: 'property-card',
      title: 'Urban Property Card (Milkat Patra)',
      titleMr: 'नगर भूमापन मिळकत पत्रिका (CTS)',
      description:
        'Authentic municipal and city survey registry records detailing carpet area, plot boundaries, and freehold tenure for urban parcels.',
      icon: <Building2 className="w-6 h-6 text-purple-700" />,
      badge: 'City Survey CTS',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      link: '/land-records',
      actionText: 'View Property Cards',
    },
    {
      id: 'mutation',
      title: 'Mutation Services (Form 6 Ferfar)',
      titleMr: 'गाव नमुना ६ फेरफार नोंदवही',
      description:
        'End-to-end processing and tracking of inheritance, sale conveyance, gift deed, and partition transfers sanctioned by Circle Officers.',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      badge: 'Real-time Tracking',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      link: '/verification',
      actionText: 'Track Ferfar Status',
    },
    {
      id: 'verification',
      title: 'Document Authenticity & Verification',
      titleMr: 'दस्त नोंदणी व सत्यता पडताळणी',
      description:
        'AI-driven dual-pane verification workstation enabling inspectors to compare physical archival scans directly with digital extractions.',
      icon: <FileCheck2 className="w-6 h-6 text-emerald-700" />,
      badge: 'Inspector Workstation',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      link: '/verification',
      actionText: 'Launch Workstation',
    },
    {
      id: 'gis-maps',
      title: 'Cadastral GIS & Tippan Survey Maps',
      titleMr: 'भूमापन नकाशा व टिप्पण रेखांकन',
      description:
        'High-resolution spatial parcel overlays, Gat survey boundaries, village road alignments, and drone aerial orthophoto maps.',
      icon: <Compass className="w-6 h-6 text-cyan-700" />,
      badge: 'Spatial GIS Mapping',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      link: '/land-records',
      actionText: 'Explore Cadastral GIS',
    },
    {
      id: 'title-search',
      title: 'Online Title Search & Encumbrance Check',
      titleMr: 'ऑनलाइन दस्त शोध व बोजा पडताळणी',
      description:
        'Check bank mortgages, court litigation injunctions, and prior legal liabilities registered against any survey or Gat number.',
      icon: <Search className="w-6 h-6 text-indigo-700" />,
      badge: 'Public Title Search',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      link: '/documents',
      actionText: 'Search Document Registry',
    },
  ];

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
            {t('navbar.services')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('services.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* 6-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-blue-900 hover:shadow-xl transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-950 transition-colors">
                    {isMarathi ? s.titleMr : s.title}
                  </h3>
                  {isMarathi && (
                    <p className="text-xs text-slate-400 font-medium">{s.title}</p>
                  )}
                  {!isMarathi && (
                    <p className="text-xs text-slate-400 font-medium">{s.titleMr}</p>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={s.link}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-900 text-slate-800 hover:text-white font-bold text-xs border border-slate-200 hover:border-blue-900 transition-all group-hover:shadow-xs"
                >
                  <span>{s.actionText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
