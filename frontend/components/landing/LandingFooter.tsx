import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ExternalLink,
  Shield,
  Heart,
  Lock,
  Globe,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Footer Pillars & Portal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Government Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-bold border border-blue-700">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white tracking-tight">
                  {t('footer.portalTitle', 'ILRDVS Land Portal')}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {t('footer.portalSubtitle')}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer.missionText')}
            </p>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> {t('footer.sslEncrypted')}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Shield className="w-3.5 h-3.5" /> {t('footer.compliance')}
              </span>
            </div>
          </div>

          {/* Col 2: Cadastral Services */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              {t('footer.cadastralServices', t('navbar.services'))}
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/land-records" className="hover:text-amber-400 transition-colors">
                  {t('navbar.landRecords')}
                </Link>
              </li>
              <li>
                <Link href="/land-records" className="hover:text-amber-400 transition-colors">
                  {t('footer.urbanPropertyCards')}
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-amber-400 transition-colors">
                  {t('navbar.mutationServices')}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-amber-400 transition-colors">
                  {t('navbar.docVerification')}
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-amber-400 transition-colors">
                  {t('footer.inspectorWorkstation')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              {t('footer.relatedPortals')}
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://mahabhumi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>{t('footer.mahabhumiPortal')}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>{t('footer.digitalIndia')}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>{t('footer.nationalPortal')}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>{t('footer.nic')}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal Policies */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              {t('footer.policiesAndHelp')}
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="#about" className="hover:text-amber-400 transition-colors">
                  {t('footer.termsOfUse')}
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-amber-400 transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-amber-400 transition-colors">
                  {t('footer.hyperlinkPolicy')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-amber-400 transition-colors">
                  {t('footer.grievancePolicy')}
                </Link>
              </li>
              <li>
                <Link href="/screen-reader" className="hover:text-amber-400 transition-colors">
                  {t('navbar.screenReader', 'Screen Reader Access')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-amber-400 font-bold hover:underline">
                  {t('navbar.employeeLogin')} &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-5 px-4 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            {t('footer.copyrightText', { year: new Date().getFullYear() })}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t('footer.builtWith')}</span>
            <span className="font-bold text-amber-400">{t('footer.sih')}</span>
            <span>&bull; {t('footer.digitalGovernance')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
