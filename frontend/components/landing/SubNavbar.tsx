'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export const SubNavbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full select-none">
      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex flex-wrap justify-between items-center shadow-xs">
        <Link href="/" className="flex items-center space-x-3.5 group">
          {/* Emblem / Brand Shield */}
          <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden bg-sovereign-800 shadow-md border border-emerald-500/30 p-1 shrink-0">
            <Image
              src="/stitch-emblem.png"
              alt="ILRDVS Cadastral Emblem"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif font-bold text-sovereign-900 tracking-tight">
                ILRDVS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                MAHARASHTRA PORTAL
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium tracking-wide">
              Intelligent Land Record Digitization &amp; Validation System
            </p>
            <p className="text-[9px] text-stone-400 font-mono">
              National Land Records Modernization Programme (NLRMP) • Digital India Land Records
            </p>
          </div>
        </Link>

        {/* Quick Action Controls */}
        <div className="flex items-center space-x-3 mt-3 lg:mt-0">
          <Link
            href="/register"
            className="border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-xs px-3.5 py-1.5 rounded flex items-center space-x-1 transition-colors shadow-2xs"
          >
            <span>Register</span>
          </Link>
          <Link
            href="/portal"
            className="bg-sovereign-800 hover:bg-sovereign-700 text-white font-semibold text-xs px-4 py-1.5 rounded shadow-sm flex items-center space-x-1.5 transition-colors border border-emerald-500/30"
          >
            <span>Citizen Portal</span>
          </Link>
          <Link
            href="/login"
            className="bg-sovereign-800 hover:bg-sovereign-700 text-white font-semibold text-xs px-4 py-1.5 rounded shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <span>Officer Login</span>
          </Link>
        </div>
      </div>

      {/* Secondary Links Menu Bar */}
      <nav className="bg-sovereign-900 text-stone-300 px-4 sm:px-8 py-2 text-xs flex flex-wrap justify-between items-center border-t border-sovereign-800">
        <div className="flex items-center space-x-5 overflow-x-auto py-0.5">
          <Link
            className="text-white font-medium hover:text-gold-500 transition-colors flex items-center space-x-1"
            href="#hero"
          >
            <span>Home</span>
          </Link>
          <Link className="hover:text-white transition-colors" href="#about">
            About Us
          </Link>
          <Link className="hover:text-white transition-colors" href="#services">
            Services
          </Link>
          <Link className="hover:text-white transition-colors" href="#stack">
            Schemes &amp; Projects
          </Link>
          <Link className="hover:text-white transition-colors" href="/documents">
            Resources
          </Link>
          <Link className="hover:text-white transition-colors" href="/portal">
            Citizen Corner
          </Link>
          <Link className="hover:text-white transition-colors" href="#faq">
            FAQ
          </Link>
          <Link className="hover:text-white transition-colors" href="#contact">
            Contact Us
          </Link>
        </div>

        {/* Quick Gov Portals */}
        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-stone-400">
          <Link href="/documents" className="hover:text-white cursor-pointer transition-colors">
            RTI
          </Link>
          <span>•</span>
          <Link href="/portal" className="hover:text-white cursor-pointer transition-colors">
            Right to Services (RTS)
          </Link>
          <span>•</span>
          <Link href="/verification" className="hover:text-white cursor-pointer transition-colors">
            Ease of Doing Business
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="text-emerald-400 font-medium cursor-pointer hover:underline transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>
    </div>
  );
};
