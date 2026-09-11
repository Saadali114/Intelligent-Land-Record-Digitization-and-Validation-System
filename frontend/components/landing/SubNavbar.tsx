'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { citizenService } from '../../services/citizen.service';
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
  UserPlus,
  Home,
  Info,
} from 'lucide-react';

export const SubNavbar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleCitizenPortalClick = (e: React.MouseEvent) => {
    if (!citizenService.isAuthenticated()) {
      e.preventDefault();
      router.push('/portal/login');
    }
  };

  return (
    <header className="w-full relative z-30 select-none">
      {/* ========================================================================= */}
      {/* TIER 1: Main Brand & Action Header (Crisp White Government Identity)      */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between py-2.5 sm:py-3.5 gap-2 sm:gap-4">
          {/* Left: Brand Identity with Emblem & Full Portal Titles */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 flex-1 sm:flex-initial">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 flex items-center justify-center text-amber-400 font-black shadow-md border border-blue-800/40 group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-5 h-5 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-blue-950">
                  ILRDVS
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                  Maharashtra Portal
                </span>
              </div>
              <h1 className="text-[11px] sm:text-sm font-bold text-slate-800 tracking-tight leading-tight truncate sm:whitespace-normal">
                {t('common.portalFullName', 'Intelligent Land Record Digitization & Validation System')}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                {t('home.bannerBadge', 'National Land Records Modernization Programme (NLRMP)')} &bull; Digital India Land Records
              </p>
            </div>
          </Link>

          {/* Right: Quick Action CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Register Account */}
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-blue-900 text-slate-800 hover:text-blue-950 font-bold text-xs bg-slate-50 hover:bg-white transition-all shadow-2xs"
            >
              <UserPlus className="w-4 h-4 text-blue-900" />
              <span>{t('navbar.register', 'Register')}</span>
            </Link>

            {/* Citizen Portal Access */}
            <Link
              href="/portal"
              onClick={handleCitizenPortalClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs hover:shadow-md transition-all border border-amber-300"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{t('navbar.citizenPortal', 'Citizen Portal')}</span>
            </Link>

            {/* Officer / Employee Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all border border-blue-700"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{t('navbar.employeeLogin', 'Officer Login')}</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Mini CTAs & Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/portal"
              onClick={handleCitizenPortalClick}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
            >
              {t('navbar.citizenPortal', 'Portal')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={t('navbar.toggleMenu', 'Toggle Menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Dedicated Sticky Sub-Navbar (Official Deep Navy Menu Bar)        */}
      {/* ========================================================================= */}
      <div className="hidden lg:block sticky top-0 z-40 bg-blue-950 text-white border-b border-blue-900 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center h-12">
          {/* Desktop Navigation Menu Links */}
          <nav className="flex items-center gap-1 text-xs font-semibold">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-blue-900/80 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('navbar.home', 'Home')}</span>
            </Link>

            {/* About Us */}
            <Link
              href="#about"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-blue-900/80 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('navbar.about', 'About Us')}</span>
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  openDropdown === 'services'
                    ? 'bg-blue-900 text-amber-300 font-bold'
                    : 'text-slate-200 hover:bg-blue-900/80 hover:text-amber-400'
                }`}
              >
                <span>{t('navbar.services', 'Services')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="/land-records"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors border-b border-slate-100"
                  >
                    <FileText className="w-4 h-4 text-blue-800 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.service1Title', '7/12 Satbara Extract')}</div>
                      <div className="text-[10px] text-slate-500">{t('services.service1Desc', 'Search survey numbers, plot tenure and rights')}</div>
                    </div>
                  </Link>
                  <Link
                    href="#services"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors border-b border-slate-100"
                  >
                    <Layers className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.items.propertyCard.title', 'Property Card (Malmatta Patrak)')}</div>
                      <div className="text-[10px] text-slate-500">{t('navbar.singleWindowPortal', 'Urban cadastral CTS property record')}</div>
                    </div>
                  </Link>
                  <Link
                    href="/verification"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors border-b border-slate-100"
                  >
                    <FileCheck2 className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.service4Title', 'Document Verification & Validation')}</div>
                      <div className="text-[10px] text-slate-500">{t('services.service4Desc', 'AI-assisted cadastral boundary & signature verification')}</div>
                    </div>
                  </Link>
                  <Link
                    href="#services"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-950 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.service2Title', 'Mutation Register (Ferfar)')}</div>
                      <div className="text-[10px] text-slate-500">{t('services.service2Desc', 'Track Form 6 legal mutation transactions')}</div>
                    </div>
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
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  openDropdown === 'schemes'
                    ? 'bg-blue-900 text-amber-300 font-bold'
                    : 'text-slate-200 hover:bg-blue-900/80 hover:text-amber-400'
                }`}
              >
                <span>{t('navbar.schemes', 'Schemes & Projects')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {openDropdown === 'schemes' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="#land-stack"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900 border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('schemes.scheme1', 'DILRMP 3.0 8-Layer Land Stack')}</div>
                    <div className="text-[10px] text-slate-500">Unified 8-Registry Model & Bhu-Aadhaar ULPIN</div>
                  </Link>
                  <Link
                    href="#about"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900 border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('schemes.scheme2', 'SVAMITVA Drone Survey')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.droneMappingSubtitle', 'High-Resolution Drone Cadastral Mapping')}</div>
                  </Link>
                  <Link
                    href="#about"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                  >
                    <div className="font-bold text-xs">{t('schemes.scheme3', 'Mahabhunaksha Geo-Referencing')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.computerizedReposSubtitle', '100% Computerized Land Repositories')}</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Resources & Downloads Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  openDropdown === 'resources'
                    ? 'bg-blue-900 text-amber-300 font-bold'
                    : 'text-slate-200 hover:bg-blue-900/80 hover:text-amber-400'
                }`}
              >
                <span>{t('navbar.resources', 'Resources')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="#faq"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900 border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.userGuides', 'User Guides & Manuals')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.stepByStepManuals', 'Step-by-step portal manuals')}</div>
                  </Link>
                  <Link
                    href="#services"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900 border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.actsRules', 'Acts & Land Revenue Rules')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.officialCadastralGuidelines', 'Official cadastral guidelines')}</div>
                  </Link>
                  <Link
                    href="#services"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900 border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.downloads', 'Circulars & Guidelines')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.circularsGuidelines', 'Circulars & guidelines')}</div>
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                  >
                    <div className="font-bold text-xs">{t('navbar.importantLinks', 'Important Links')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.stateCentralPortals', 'State & Central Land Portals')}</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Citizen Corner Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('citizen')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  openDropdown === 'citizen'
                    ? 'bg-blue-900 text-amber-300 font-bold'
                    : 'text-slate-200 hover:bg-blue-900/80 hover:text-amber-400'
                }`}
              >
                <span>{t('navbar.citizenCorner', 'Citizen Corner')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {openDropdown === 'citizen' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="/portal"
                    onClick={handleCitizenPortalClick}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 hover:bg-amber-100/70 text-amber-950 font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-xs">{t('navbar.citizenPortal', 'Citizen Self-Service Portal')}</div>
                      <div className="text-[10px] text-amber-800 font-normal">{t('navbar.digitizeAndTrack', 'Digitize and track extracts')}</div>
                    </div>
                  </Link>
                  <Link
                    href="/land-records"
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                  >
                    <div className="font-bold text-xs">{t('citizenCorner.portalLink', 'Search 7/12 Records')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.titleSearchSubtitle', 'Title Search & Digital Extract Copy')}</div>
                  </Link>
                  <Link
                    href="/verification"
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                  >
                    <div className="font-bold text-xs">{t('citizenCorner.applicationStatus', 'Application Status')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.trackRequestSubtitle', 'Track Mutation or Verification Request')}</div>
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                  >
                    <div className="font-bold text-xs">{t('citizenCorner.grievance', 'Grievance Redressal')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.grievanceSubtitle', 'Register Land Record Discrepancy')}</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Link: FAQs */}
            <Link
              href="#faq"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-blue-900/80 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <span>{t('navbar.faq', 'FAQs')}</span>
            </Link>

            {/* Direct Link: Contact Us */}
            <Link
              href="#contact"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-blue-900/80 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <span>{t('navbar.contact', 'Contact Us')}</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER NAVIGATION                                                  */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs font-semibold text-slate-700 shadow-xl max-h-[80vh] overflow-y-auto">
          {/* Action CTAs Strip */}
          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200 text-center transition-colors"
          >
            + {t('registration.registerNow', { defaultValue: 'Register / Apply for Access' })}
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/portal"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleCitizenPortalClick(e);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{t('navbar.citizenPortal', 'Citizen Portal')}</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition-colors"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{t('navbar.employeeLogin', 'Officer Login')}</span>
            </Link>
          </div>

          {/* Core Navigation Links */}
          <div className="border-t border-slate-100 pt-2 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-900"
            >
              <Home className="w-4 h-4 text-blue-900" />
              <span>{t('navbar.home', 'Home')}</span>
            </Link>

            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <Info className="w-4 h-4 text-blue-700" />
              <span>{t('navbar.about', 'About Us')}</span>
            </Link>

            <Link
              href="#land-stack"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50/60 hover:bg-blue-100/60 text-blue-950 font-bold"
            >
              <Layers className="w-4 h-4 text-blue-800" />
              <span>{t('navbar.landStack', '8-Layer Land Stack & ULPIN')}</span>
            </Link>

            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('navbar.services', 'Land Related Services')}</span>
            </Link>

            <div className="pl-6 space-y-1 border-l-2 border-slate-100 my-1">
              <Link
                href="/land-records"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-blue-900 text-[11px]"
              >
                • {t('services.service1Title', '7/12 Satbara Extract')}
              </Link>
              <Link
                href="/land-records"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-blue-900 text-[11px]"
              >
                • {t('services.service2Title', '8A Khata Extract')}
              </Link>
              <Link
                href="/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-blue-900 text-[11px]"
              >
                • {t('services.service3Title', 'Ferfar (Form 6) Mutation')}
              </Link>
              <Link
                href="/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-blue-900 text-[11px]"
              >
                • {t('services.service4Title', 'Verification Workstation')}
              </Link>
            </div>

            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <HelpCircle className="w-4 h-4 text-indigo-700" />
              <span>{t('navbar.faq', 'Frequently Asked Questions')}</span>
            </Link>

            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>{t('navbar.contact', 'Contact & Grievance')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
