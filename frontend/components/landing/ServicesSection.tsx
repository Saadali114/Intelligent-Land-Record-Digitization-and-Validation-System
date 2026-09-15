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

interface ServiceConfig {
  key: string;
  icon: React.ReactNode;
  badgeColor: string;
  link: string;
}

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const serviceConfigs: ServiceConfig[] = [
    {
      key: 'satbara',
      icon: <FileText className="w-6 h-6 text-blue-700" />,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      link: '/check-ownership',
    },
    {
      key: 'propertyCard',
      icon: <Building2 className="w-6 h-6 text-purple-700" />,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      link: '/land-records',
    },
    {
      key: 'mutation',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      link: '/check-ownership?tab=mutation',
    },
    {
      key: 'verification',
      icon: <FileCheck2 className="w-6 h-6 text-emerald-700" />,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      link: '/verification',
    },
    {
      key: 'gisMaps',
      icon: <Compass className="w-6 h-6 text-cyan-700" />,
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      link: '/gis-map',
    },
    {
      key: 'titleSearch',
      icon: <Search className="w-6 h-6 text-indigo-700" />,
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      link: '/documents',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
            {t('navbar.services')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('services.title')}
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* 6-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {serviceConfigs.map((s) => (
            <div
              key={s.key}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-blue-900 hover:shadow-xl transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${s.badgeColor}`}>
                    {t(`services.items.${s.key}.badge`)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-950 transition-colors">
                    {t(`services.items.${s.key}.title`)}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium" lang="mr">
                    {t(`services.items.${s.key}.titleAlt`)}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(`services.items.${s.key}.description`)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={s.link}
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <span>{t(`services.items.${s.key}.actionText`)}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
