'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Files,
  CheckCheck,
  Users,
  UserCheck,
  X,
  FileCheck2,
  LogOut,
  PanelLeftClose,
  Map,
  FileText,
  History,
  ShieldCheck,
  Scale,
  Sparkles,
  Activity,
  Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { logout } = useAuth();

  const coreWorkstation = [
    {
      label: 'प्रशासन कक्ष (Workstation)',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'फेरफार नोंद (Mutation Queue)',
      href: '/verification',
      icon: CheckCheck,
      badge: '28',
    },
    {
      label: 'भू-नकाशा (GIS Cadastral)',
      href: '/land-records',
      icon: Map,
    },
    {
      label: 'मोडी लिपी (OCR Archive)',
      href: '/documents',
      icon: History,
    },
    {
      label: 'मंजुरी अहवाल (Audit Logs)',
      href: '/users',
      icon: ShieldCheck,
    },
  ];

  const revenueRecords = [
    {
      label: '७/१२ व ८-अ (7/12 & 8-A)',
      href: '/land-records',
      icon: FileSpreadsheet,
    },
    {
      label: 'तक्रार नोंदणी (RTS Appeals)',
      href: '/verification',
      icon: Scale,
    },
  ];

  const renderSidebarContent = (collapsed: boolean) => (
    <div
      className={cn(
        'flex h-full flex-col justify-between bg-[#0a2918] text-slate-200 transition-all duration-300 border-r border-emerald-950/80 select-none',
        collapsed ? 'py-4 px-2 items-center' : 'py-4 px-3'
      )}
    >
      <div className={cn('w-full', collapsed && 'flex flex-col items-center')}>
        {/* Header Branding */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl bg-[#14532d] border border-emerald-500/50 flex items-center justify-center text-amber-300 font-bold shadow-md shrink-0"
              title="ILRDVS महा-भूमी"
            >
              <FileCheck2 className="w-5 h-5" />
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand Sidebar"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#0f3e28] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4 text-emerald-400 rotate-180" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 mb-5 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#14532d] border border-emerald-500/50 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-xs">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-white tracking-wide truncate">
                    ILRDVS महा-भूमी
                  </h2>
                  <p className="text-[10px] text-emerald-300 font-medium truncate">
                    DILRMP 3.0 Land Records
                  </p>
                </div>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="md:hidden p-1 rounded text-emerald-300 hover:text-white hover:bg-[#0f3e28]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Division & Status Pill */}
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#0f3e28] border border-emerald-900/60 text-[10px]">
              <span className="font-mono font-bold text-emerald-200">HAVELI DIV-411028</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold uppercase text-[9px]">
                LIVE GIS
              </span>
            </div>
          </div>
        )}

        {/* Section 1: CORE WORKSTATION */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">
              CORE WORKSTATION
            </div>
          )}

          <nav className="space-y-1">
            {coreWorkstation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-[#14532d] text-white font-bold shadow-xs border border-emerald-500/50'
                      : 'text-slate-300 hover:bg-[#0f3e28] hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-emerald-300')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: REVENUE RECORDS & ACTS */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">
              REVENUE RECORDS & ACTS
            </div>
          )}

          <nav className="space-y-1">
            {revenueRecords.map((item) => {
              const Icon = item.icon;
              const isActive = false;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-[#14532d] text-white font-bold shadow-xs border border-emerald-500/50'
                      : 'text-slate-300 hover:bg-[#0f3e28] hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-emerald-300" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer: NIC Sync & Sign Out */}
      <div className="pt-3 border-t border-emerald-950/80 w-full space-y-2">
        {!collapsed && (
          <div className="px-2 py-1.5 rounded bg-[#0f3e28]/70 border border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              NIC Server Sync:
            </span>
            <span className="font-mono font-bold text-white">99.98%</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-2 w-full p-2 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/50 transition-colors',
            collapsed ? 'justify-center' : 'px-2.5'
          )}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 transition-all duration-300 z-30',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-[#0a2918] shadow-2xl z-10">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
};
