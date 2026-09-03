'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LogOut, User as UserIcon, Shield, Menu, Building2 } from 'lucide-react';
import Link from 'next/link';

export interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 shadow-sm font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Digital Land Registry Portal
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                Govt of India / DLRS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Intelligent Land Record Digitization & Validation System
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">{user.name}</span>
              <Badge status={user.role} />
            </div>
            <span className="text-[11px] text-slate-500">
              {user.department} &bull; {user.district}
            </span>
          </div>

          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
              <UserIcon className="w-4 h-4" />
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1 text-xs font-medium">Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};
