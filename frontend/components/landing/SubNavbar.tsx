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
  MapPin,
  Shield,
  FileCheck,
  Briefcase,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';

const DISTRICTS_LIST = [
  { key: 'pune', defaultName: 'Pune' },
  { key: 'mumbaiCity', defaultName: 'Mumbai City' },
  { key: 'mumbaiSuburban', defaultName: 'Mumbai Suburban' },
  { key: 'nagpur', defaultName: 'Nagpur' },
  { key: 'nashik', defaultName: 'Nashik' },
  { key: 'thane', defaultName: 'Thane' },
  { key: 'chhatrapatiSambhajinagar', defaultName: 'Chhatrapati Sambhajinagar' },
  { key: 'kolhapur', defaultName: 'Kolhapur' },
  { key: 'solapur', defaultName: 'Solapur' },
  { key: 'amravati', defaultName: 'Amravati' },
  { key: 'nanded', defaultName: 'Nanded' },
  { key: 'satara', defaultName: 'Satara' },
];

export const SubNavbar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDistrictOpen, setMobileDistrictOpen] = useState(false);
  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string | null>(null);
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
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Left: Brand Identity with Maharashtra Emblem & Full Portal Titles */}
          <Link href="/" className="flex items-center gap-3 group min-w-0 flex-1 sm:flex-initial">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#14532d] border border-emerald-600/30 flex items-center justify-center text-amber-300 font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="space-y-0 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#14532d]">
                  ILRDVS महाराष्ट्र
                </span>
              </div>
              <h1 className="text-[10px] sm:text-[11px] font-bold text-[#166534] tracking-wide uppercase leading-tight truncate sm:whitespace-normal">
                INTELLIGENT LAND RECORD DIGITIZATION AND VALIDATION SYSTEM
              </h1>
            </div>
          </Link>

          {/* Right: Action CTAs: Register, Citizen Portal, and Officer Portal */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* 1. Register - Crisp Emerald Pill */}
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3 lg:px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#14532d] font-bold text-xs shadow-2xs hover:shadow-xs transition-all border border-emerald-300"
            >
              <UserPlus className="w-4 h-4 text-[#166534]" />
              <span>नोंदणी (Register)</span>
            </Link>

            {/* 2. Citizen Portal - Amber / Gold Pill */}
            <Link
              href="/portal"
              onClick={handleCitizenPortalClick}
              className="inline-flex items-center gap-1.5 px-3 lg:px-3.5 py-2 rounded-full bg-[#fde68a] hover:bg-[#fcd34d] text-amber-950 font-bold text-xs shadow-2xs hover:shadow-xs transition-all border border-amber-300/80"
            >
              <ShieldCheck className="w-4 h-4 text-amber-900" />
              <span>नागरिक पोर्टल (Citizen)</span>
            </Link>

            {/* 3. Officer Portal - Deep Green Pill */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all border border-[#0f3e28]"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <LogIn className="w-2.5 h-2.5 text-white" />
              </div>
              <span>अधिकारी पोर्टल (Officer)</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Mini CTAs & Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <Link
              href="/register"
              className="px-2 py-1 rounded-full bg-emerald-50 text-[#14532d] font-bold text-[10px] border border-emerald-300"
            >
              नोंदणी
            </Link>
            <Link
              href="/portal"
              onClick={handleCitizenPortalClick}
              className="px-2 py-1 rounded-full bg-[#fde68a] text-amber-950 font-bold text-[10px] border border-amber-300"
            >
              नागरिक
            </Link>
            <Link
              href="/login"
              className="p-1.5 rounded-full bg-[#14532d] text-white"
              title="अधिकारी पोर्टल (Officer Login)"
            >
              <LogIn className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={t('navbar.toggleMenu', 'Toggle Menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Dedicated Sticky Sub-Navbar (Cadastral Forest Green Menu Bar)     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block sticky top-0 z-40 bg-[#14532d] text-white border-b border-[#0f3e28] shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          {/* Desktop Navigation Menu Links */}
          <nav className="flex items-center gap-1 text-xs font-semibold">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#166534] text-emerald-50 hover:text-amber-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('navbar.home', 'Home')}</span>
            </Link>

            {/* About Us */}
            <Link
              href="#about"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#166534] text-emerald-50 hover:text-amber-300 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-emerald-300" />
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  openDropdown === 'services'
                    ? 'bg-[#166534] text-amber-300 font-bold'
                    : 'text-emerald-50 hover:bg-[#166534] hover:text-amber-300'
                }`}
              >
                <span>{t('navbar.services', 'Services')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-emerald-100 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="/land-records"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] transition-colors border-b border-slate-100"
                  >
                    <FileText className="w-4 h-4 text-[#14532d] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.service1Title', '7/12 Satbara Extract')}</div>
                      <div className="text-[10px] text-slate-500">{t('services.service1Desc', 'Search survey numbers, plot tenure and rights')}</div>
                    </div>
                  </Link>
                  <Link
                    href="#services"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] transition-colors border-b border-slate-100"
                  >
                    <Layers className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.items.propertyCard.title', 'Property Card (Malmatta Patrak)')}</div>
                      <div className="text-[10px] text-slate-500">{t('navbar.singleWindowPortal', 'Urban cadastral CTS property record')}</div>
                    </div>
                  </Link>
                  <Link
                    href="/verification"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] transition-colors border-b border-slate-100"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{t('services.service4Title', 'Document Verification & Validation')}</div>
                      <div className="text-[10px] text-slate-500">{t('services.service4Desc', 'AI-assisted cadastral boundary & signature verification')}</div>
                    </div>
                  </Link>
                  <Link
                    href="#services"
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] transition-colors"
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  openDropdown === 'schemes'
                    ? 'bg-[#166534] text-amber-300 font-bold'
                    : 'text-emerald-50 hover:bg-[#166534] hover:text-amber-300'
                }`}
              >
                <span>{t('navbar.schemes', 'Schemes & Projects')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {openDropdown === 'schemes' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-emerald-100 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="#land-stack"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('schemes.scheme1', 'DILRMP 3.0 8-Layer Land Stack')}</div>
                    <div className="text-[10px] text-slate-500">Unified 8-Registry Model & Bhu-Aadhaar ULPIN</div>
                  </Link>
                  <Link
                    href="#about"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('schemes.scheme2', 'SVAMITVA Drone Survey')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.droneMappingSubtitle', 'High-Resolution Drone Cadastral Mapping')}</div>
                  </Link>
                  <Link
                    href="#about"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d]"
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  openDropdown === 'resources'
                    ? 'bg-[#166534] text-amber-300 font-bold'
                    : 'text-emerald-50 hover:bg-[#166534] hover:text-amber-300'
                }`}
              >
                <span>{t('navbar.resources', 'Resources')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-white border border-emerald-100 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="#faq"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.userGuides', 'User Guides & Manuals')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.stepByStepManuals', 'Step-by-step portal manuals')}</div>
                  </Link>
                  <Link
                    href="#services"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.actsRules', 'Acts & Land Revenue Rules')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.officialCadastralGuidelines', 'Official cadastral guidelines')}</div>
                  </Link>
                  <Link
                    href="#services"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d] border-b border-slate-100"
                  >
                    <div className="font-bold text-xs">{t('resources.downloads', 'Circulars & Guidelines')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.circularsGuidelines', 'Circulars & guidelines')}</div>
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-4 py-2.5 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d]"
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  openDropdown === 'citizen'
                    ? 'bg-[#166534] text-amber-300 font-bold'
                    : 'text-emerald-50 hover:bg-[#166534] hover:text-amber-300'
                }`}
              >
                <span>{t('navbar.citizenCorner', 'Citizen Corner')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {openDropdown === 'citizen' && (
                <div className="absolute top-full left-0 w-72 rounded-xl bg-white border border-emerald-100 shadow-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 text-slate-800">
                  <Link
                    href="/portal"
                    onClick={handleCitizenPortalClick}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50/90 border-b border-amber-200/80 hover:bg-amber-100/80 text-amber-950 font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <div className="text-xs">{t('navbar.citizenPortal', 'Citizen Self-Service Portal')}</div>
                      <div className="text-[10px] text-amber-800 font-normal">{t('navbar.digitizeAndTrack', 'Digitize and track extracts')}</div>
                    </div>
                  </Link>
                  <Link
                    href="/land-records"
                    className="block px-4 py-2 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d]"
                  >
                    <div className="font-bold text-xs">{t('citizenCorner.portalLink', 'Search 7/12 Records')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.titleSearchSubtitle', 'Title Search & Digital Extract Copy')}</div>
                  </Link>
                  <Link
                    href="/verification"
                    className="block px-4 py-2 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d]"
                  >
                    <div className="font-bold text-xs">{t('citizenCorner.applicationStatus', 'Application Status')}</div>
                    <div className="text-[10px] text-slate-500">{t('navbar.trackRequestSubtitle', 'Track Mutation or Verification Request')}</div>
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-4 py-2 hover:bg-emerald-50/70 text-slate-700 hover:text-[#14532d]"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#166534] text-emerald-50 hover:text-amber-300 transition-colors"
            >
              <span>{t('navbar.faq', 'FAQs')}</span>
            </Link>

            {/* Direct Link: Contact Us */}
            <Link
              href="#contact"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#166534] text-emerald-50 hover:text-amber-300 transition-colors"
            >
              <span>{t('navbar.contact', 'Contact Us')}</span>
            </Link>
          </nav>

          {/* Right Side Quick Links in Menu Bar */}
          <div className="flex items-center gap-2">
            <Link
              href="#services"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#166534] hover:bg-[#1b7e40] text-amber-300 font-bold text-[11px] border border-emerald-500/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>RTS Guarantee: 15 Days</span>
            </Link>
          </div>
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
            className="block px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#14532d] font-bold border border-emerald-200 text-center transition-colors"
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
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-950" />
              <span>{t('navbar.citizenPortal', 'Citizen Portal')}</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold transition-colors"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>{t('navbar.employeeLogin', 'Officer Login')}</span>
            </Link>
          </div>

          {/* Governance Tools & Direct Portals in Mobile Burger */}
          <div className="p-3 rounded-2xl bg-[#f6f8f4] border border-slate-200 space-y-2.5">
            {/* Direct Dashboard Link */}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>{t('navbar.dashboard', 'Admin & Operations Dashboard')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            {/* Districts Selector Accordion */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setMobileDistrictOpen(!mobileDistrictOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {t('navbar.districts', 'Districts')}:{' '}
                    <span className="text-[#14532d] font-extrabold">
                      {selectedDistrictKey ? t(`districts.${selectedDistrictKey}`, selectedDistrictKey) : t('common.all', 'All Districts')}
                    </span>
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${mobileDistrictOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileDistrictOpen && (
                <div className="p-2 border-t border-slate-200 grid grid-cols-2 gap-1 max-h-48 overflow-y-auto bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrictKey(null);
                      setMobileDistrictOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded text-[11px] font-bold ${
                      selectedDistrictKey === null ? 'bg-[#14532d] text-white' : 'text-slate-800 hover:bg-emerald-50'
                    }`}
                  >
                    ✓ {t('common.all', 'All Districts')}
                  </button>
                  {DISTRICTS_LIST.map((dist) => (
                    <button
                      key={dist.key}
                      type="button"
                      onClick={() => {
                        setSelectedDistrictKey(dist.key);
                        setMobileDistrictOpen(false);
                      }}
                      className={`text-left px-2 py-1.5 rounded text-[11px] truncate transition-colors ${
                        selectedDistrictKey === dist.key
                          ? 'bg-[#14532d] text-white font-bold'
                          : 'text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      {t(`districts.${dist.key}`, dist.defaultName)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Governance Portals (RTI, RTS, EODB) */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
              <Link
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#14532d] font-bold border border-slate-200 flex flex-col items-center gap-1 shadow-2xs transition-colors"
                title={t('navbar.rtiTitle', 'Right to Information')}
              >
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>RTI</span>
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#14532d] font-bold border border-slate-200 flex flex-col items-center gap-1 shadow-2xs transition-colors"
                title={t('navbar.rtsTitle', 'Right to Services')}
              >
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>RTS</span>
              </Link>
              <Link
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#14532d] font-bold border border-slate-200 flex flex-col items-center gap-1 shadow-2xs transition-colors"
                title={t('navbar.eodbTitle', 'Ease of Doing Business')}
              >
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <span>EODB</span>
              </Link>
            </div>
          </div>

          {/* Core Navigation Links */}
          <div className="border-t border-slate-100 pt-2 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/60 text-slate-900 font-semibold"
            >
              <Home className="w-4 h-4 text-[#14532d]" />
              <span>{t('navbar.home', 'Home')}</span>
            </Link>

            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/60 text-slate-700"
            >
              <Info className="w-4 h-4 text-emerald-700" />
              <span>{t('navbar.about', 'About Us')}</span>
            </Link>

            <Link
              href="#land-stack"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 text-[#14532d] font-bold"
            >
              <Layers className="w-4 h-4 text-[#14532d]" />
              <span>{t('navbar.landStack', '8-Layer Land Stack & ULPIN')}</span>
            </Link>

            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/60 text-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('navbar.services', 'Land Related Services')}</span>
            </Link>

            <div className="pl-6 space-y-1 border-l-2 border-emerald-200 my-1">
              <Link
                href="/land-records"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-[#14532d] text-[11px]"
              >
                • {t('services.service1Title', '7/12 Satbara Extract')}
              </Link>
              <Link
                href="/land-records"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-[#14532d] text-[11px]"
              >
                • {t('services.service2Title', '8A Khata Extract')}
              </Link>
              <Link
                href="/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-[#14532d] text-[11px]"
              >
                • {t('services.service3Title', 'Ferfar (Form 6) Mutation')}
              </Link>
              <Link
                href="/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 text-slate-600 hover:text-[#14532d] text-[11px]"
              >
                • {t('services.service4Title', 'Verification Workstation')}
              </Link>
            </div>

            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/60 text-slate-700"
            >
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>{t('navbar.faq', 'Frequently Asked Questions')}</span>
            </Link>

            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/60 text-slate-700"
            >
              <Phone className="w-4 h-4 text-[#14532d]" />
              <span>{t('navbar.contact', 'Contact & Grievance')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
