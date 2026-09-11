import React from 'react';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Award,
  Users,
  Building2,
  FileText,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const AboutUsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            {t('about.badge') || 'National Land Records Modernization Programme (DILRMP)'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('about.title') || 'Preserving & Safeguarding India’s Cadastral Heritage'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t('about.description') || 'ILRDVS was created to modernize millions of fragile, hand-written land records into structured, tamper-evident digital assets using neural computer vision and human inspector governance.'}
          </p>
        </div>

        {/* 2-Column Story & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-sm text-slate-600 leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" />
              {t('about.challengeTitle')}
            </h3>
            <p>
              {t('about.challengeP1')}
            </p>
            <p>
              {t('about.challengeP2')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-blue-950 font-mono">8 Layers</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">DILRMP 3.0</div>
                <div className="text-[11px] text-slate-500">Unified Land Stack</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-indigo-900 font-mono">14 Digits</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Bhu-Aadhaar</div>
                <div className="text-[11px] text-slate-500">Spatial ULPIN Anchor</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-emerald-800 font-mono">100%</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{t('about.auditTrailTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('about.auditTrailDesc')}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xl font-black text-purple-800 font-mono">98.4%</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{t('about.accuracyTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('about.accuracyDesc')}</div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('about.pillar1Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('about.pillar1Desc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('about.pillar2Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('about.pillar2Desc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-purple-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('about.pillar3Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('about.pillar3Desc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-amber-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('about.pillar4Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('about.pillar4Desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
