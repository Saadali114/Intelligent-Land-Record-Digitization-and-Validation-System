'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  ChevronDown,
  LogIn,
  Menu,
  X,
  FileText,
  FileCheck2,
  FolderDown,
  Layers,
  Sparkles,
  Award,
  Users,
  HelpCircle,
  Phone,
  Image,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const SubNavbar: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 flex items-center justify-center text-amber-400 font-black shadow-md border border-blue-800/40 group-hover:scale-105 transition-transform shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-blue-950">ILRDVS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                AI Cadastral
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 tracking-tight leading-tight line-clamp-1">
              {t('common.portalFullName')}
            </p>
            <p className="text-[9px] text-slate-400 font-medium">
              {t('home.bannerBadge')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-700">
          {/* Home */}
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
          >
            {t('navbar.home')}
          </Link>

          {/* About */}
          <Link
            href="#about"
            className="px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
          >
            {t('navbar.about')}
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('services')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <span>{t('navbar.services')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'services' && (
              <div className="absolute top-full left-0 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <Link
                  href="/land-records"
                  className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-800 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{t('services.service1Title')}</div>
                    <div className="text-[10px] text-slate-500">{t('services.service1Desc')}</div>
                  </div>
                </Link>
                <Link
                  href="#services"
                  className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                >
                  <Layers className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{t('navbar.services')}</div>
                    <div className="text-[10px] text-slate-500">Single window digital portal</div>
                  </div>
                </Link>
                <Link
                  href="/verification"
                  className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                >
                  <FileCheck2 className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{t('services.service4Title')}</div>
                    <div className="text-[10px] text-slate-500">{t('services.service4Desc')}</div>
                  </div>
                </Link>
                <Link
                  href="#services"
                  className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{t('services.service2Title')}</div>
                    <div className="text-[10px] text-slate-500">{t('services.service2Desc')}</div>
                  </div>
                </Link>
                <Link
                  href="#services"
                  className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-indigo-700 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{t('services.service3Title')}</div>
                    <div className="text-[10px] text-slate-500">{t('services.service3Desc')}</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('resources')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <span>{t('navbar.resources')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'resources' && (
              <div className="absolute top-full left-0 w-60 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <Link
                  href="#faq"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('resources.userGuides')}</div>
                  <div className="text-[10px] text-slate-500">Step-by-step portal manuals</div>
                </Link>
                <Link
                  href="#services"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('resources.actsRules')}</div>
                  <div className="text-[10px] text-slate-500">Official cadastral guidelines</div>
                </Link>
                <Link
                  href="#services"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('resources.downloads')}</div>
                  <div className="text-[10px] text-slate-500">Gazette circulars & guidelines</div>
                </Link>
                <Link
                  href="#contact"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">Important Links</div>
                  <div className="text-[10px] text-slate-500">State & Central Land Portals</div>
                </Link>
              </div>
            )}
          </div>

          {/* Schemes & Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('schemes')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <span>{t('navbar.schemes')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'schemes' && (
              <div className="absolute top-full left-0 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <Link
                  href="#about"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('schemes.scheme1')}</div>
                  <div className="text-[10px] text-slate-500">DILRMP, NLRMP, SVAMITVA</div>
                </Link>
                <Link
                  href="#notices"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('schemes.scheme2')}</div>
                  <div className="text-[10px] text-slate-500">High-Resolution Drone Cadastral Mapping</div>
                </Link>
                <Link
                  href="#about"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('schemes.scheme3')}</div>
                  <div className="text-[10px] text-slate-500">100% Computerized Repositories</div>
                </Link>
              </div>
            )}
          </div>

          {/* News & Notices */}
          <Link
            href="#notices"
            className="px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors relative"
          >
            <span>{t('navbar.news')}</span>
            <span className="absolute top-1.5 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </Link>

          {/* Citizen Corner Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('citizen')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <span>{t('navbar.citizenCorner')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'citizen' && (
              <div className="absolute top-full left-0 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <Link
                  href="/portal"
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 hover:bg-amber-100/70 text-amber-950 font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs">{t('navbar.citizenPortal')}</div>
                    <div className="text-[10px] text-amber-800 font-normal">{t('navbar.digitizeAndTrack')}</div>
                  </div>
                </Link>
                <Link
                  href="#services"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('citizenCorner.portalLink')}</div>
                  <div className="text-[10px] text-slate-500">Title Search & Digital Extract Copy</div>
                </Link>
                <Link
                  href="/verification"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('citizenCorner.applicationStatus')}</div>
                  <div className="text-[10px] text-slate-500">Track Mutation or Verification Request</div>
                </Link>
                <Link
                  href="#contact"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('citizenCorner.grievance')}</div>
                  <div className="text-[10px] text-slate-500">Register Land Record Discrepancy</div>
                </Link>
                <Link
                  href="#contact"
                  className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold">{t('citizenCorner.feedback')}</div>
                  <div className="text-[10px] text-slate-500">Portal Experience & Suggestions</div>
                </Link>
              </div>
            )}
          </div>

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('more')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <span>{t('navbar.faq')} &bull; {t('navbar.contact')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'more' && (
              <div className="absolute top-full right-0 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <Link
                  href="#gallery"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <Image className="w-4 h-4 text-blue-700" />
                  <span>{t('navbar.gallery')}</span>
                </Link>
                <Link
                  href="#faq"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>{t('navbar.faq')}</span>
                </Link>
                <Link
                  href="#contact"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                >
                  <Phone className="w-4 h-4 text-indigo-700" />
                  <span>{t('navbar.contact')}</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA: Language Switcher, Citizen Portal & Employee Login */}
        <div className="hidden sm:flex items-center gap-2.5">
          <LanguageSwitcher variant="header" />

          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all border border-amber-300"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>{t('navbar.citizenPortal')}</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all border border-blue-700"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>{t('navbar.employeeLogin')}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex xl:hidden items-center gap-2">
          <LanguageSwitcher variant="header" />
          <Link
            href="/portal"
            className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
          >
            Portal
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-xs font-semibold text-slate-700">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('navbar.home')}
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('navbar.about')}
          </Link>
          <Link
            href="/land-records"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('services.service1Title')}
          </Link>
          <Link
            href="/verification"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('services.service4Title')}
          </Link>
          <Link
            href="#notices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('navbar.news')}
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('navbar.faq')}
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t('navbar.contact')}
          </Link>
          <div className="pt-2 space-y-2">
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{t('navbar.citizenPortal')}</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white font-bold"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{t('navbar.employeeLogin')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
