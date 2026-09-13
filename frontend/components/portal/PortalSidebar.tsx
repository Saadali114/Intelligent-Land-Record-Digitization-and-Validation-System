'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Layers,
  UploadCloud,
  Search,
  Scale,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  LogOut,
  X,
} from 'lucide-react';
import { citizenService } from '../../services/citizen.service';

export interface PortalSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const citizenNav = [
    {
      name: 'Dashboard (Overview)',
      href: '/portal',
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: 'My Land Parcels & 7/12 (माझी जमीन)',
      href: '/portal/land-records',
      icon: FileSpreadsheet,
    },
    {
      name: 'Form 6 Mutation Tracker (फेरफार अर्ज)',
      href: '/portal/applications',
      icon: FileText,
    },
    {
      name: '8-Layer Land Stack (भूमी पासबुक)',
      href: '/land-records',
      icon: Layers,
    },
    {
      name: 'Upload Document (दस्तऐवज)',
      href: '/portal/upload',
      icon: UploadCloud,
    },
    {
      name: 'Title Search & Encumbrance (बोजा)',
      href: '/land-records',
      icon: Search,
    },
    {
      name: 'Grievance & RTS (तक्रार निवारण)',
      href: '/verification',
      icon: Scale,
    },
    {
      name: 'Citizen Support & FAQs (मदत केंद्र)',
      href: '/documents',
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    citizenService.logout();
    router.push('/portal/login');
  };

  const content = (
    <div className="flex flex-col h-full bg-white text-slate-800 w-64 border-r border-slate-200 select-none justify-between">
      <div>
        {/* Header Title */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            नागरिक सेवा पोर्टल / CITIZEN SERVICES
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1">
          {citizenNav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#dcfce7] text-[#14532d] shadow-2xs font-bold border border-emerald-300/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#14532d]' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1 font-bold text-slate-700 mb-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            DigiLocker & UIDAI Linked
          </div>
          Biometric & Aadhaar e-KYC Active for Parcel Validation.
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>लॉगआउट (Sign Out)</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-[calc(100vh-5.5rem)] sticky top-[5.5rem]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
