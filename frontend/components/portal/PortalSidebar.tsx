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

  const workspaceNav = [
    {
      name: 'नागरिक कक्ष (Citizen Hub)',
      href: '/portal',
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: 'फेरफार नोंद (Mutation Queue)',
      href: '/portal/applications',
      badge: '28',
      icon: FileText,
    },
    {
      name: 'भू-नकाशा (GIS Cadastral)',
      href: '/portal/land-records',
      tag: 'EPSG:3857',
      icon: Layers,
    },
    {
      name: 'मोडी लिपी (OCR Archival)',
      href: '/portal/upload',
      icon: UploadCloud,
    },
    {
      name: 'मंजूरी अहवाल (Audit Logs)',
      href: '/documents',
      icon: ShieldCheck,
    },
  ];

  const registersNav = [
    {
      name: '७/१२ व ८-अ (7/12 & 8-A)',
      href: '/portal/land-records',
      icon: FileSpreadsheet,
    },
    {
      name: 'तक्रार नोंदवही (RTS Appeals)',
      href: '/verification',
      icon: Scale,
    },
    {
      name: 'मदत केंद्र (Help & FAQs)',
      href: '/#faq',
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    citizenService.logout();
    router.push('/portal/login');
  };

  const content = (
    <div className="flex flex-col h-full bg-[#132e22] text-white w-72 select-none justify-between border-r border-[#0b1d16] shadow-md">
      <div className="overflow-y-auto">
        {/* District Division Header Pill */}
        <div className="p-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 border border-white/15">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-xs text-emerald-100 font-bold tracking-wide">
                HAVELI DIV #411028
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-bold">
              ONLINE
            </span>
          </div>
        </div>

        {/* Section 1: Citizen Workspace */}
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-300/75 font-bold">
            Citizen Workspace
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {workspaceNav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'bg-white/20 text-white font-bold shadow-[inset_3px_0_0_0_#85f8c4] border border-emerald-500/30'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="text-[10px] font-mono text-emerald-300">
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section 2: Statutory Registers */}
        <div className="px-3 pt-4 pb-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-300/75 font-bold">
            Statutory Registers
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {registersNav.map((item) => {
            const active = false;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'bg-white/20 text-white font-bold shadow-[inset_3px_0_0_0_#85f8c4]'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 text-emerald-400/80" />
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: NIC Central Gateway & Sign Out */}
      <div className="p-3 bg-black/20 border-t border-white/10 space-y-2">
        <div className="p-2.5 bg-white/10 rounded-lg border border-white/15 flex flex-col gap-1.5 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-emerald-200/80 font-medium">NIC Central Gateway</span>
            <span className="text-emerald-300 font-bold font-mono">99.98% Sync</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-[99.98%]"></div>
          </div>
          <div className="flex items-center justify-between pt-0.5 text-emerald-300/70 font-mono">
            <span>Node: MH-PUN-04</span>
            <span className="text-emerald-300 font-bold">Encrypted</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>लॉगआउट (Sign Out)</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-900/60 font-bold text-rose-200">
            EXIT
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-[#132e22] shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
