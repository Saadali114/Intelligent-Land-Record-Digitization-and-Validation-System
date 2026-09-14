'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  Compass,
  FileText,
  Clock,
  Home,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { MainNavbar } from '../../components/landing';

// Dynamically import Leaflet Cadastral Viewer with SSR disabled
const CadastralGisViewer = dynamic(
  () => import('../../components/gis/CadastralGisViewer').then((mod) => mod.CadastralGisViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-108px)] w-full bg-slate-100 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin" />
        <p className="text-xs font-bold text-slate-800">
          Initializing ILRDVS Cadastral GIS Engine (भू-नकाशा)...
        </p>
      </div>
    ),
  }
);

export default function GisMapPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none font-sans">
      {/* 1. Official Top Utility Navbar (Districts, RTS, RTI, Accessibility, Language) */}
      <MainNavbar />

      {/* 2. Official ILRDVS Cadastral GIS Header (Deep Navy & Amber Gold) */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b-2 border-amber-400 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-900/90 border border-blue-700 text-amber-400 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>ILRDVS</span>
                  <span className="text-amber-400 font-serif">भू-नकाशा</span>
                </h1>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-800/80 text-blue-200 border border-blue-700">
                  Cadastral GIS Portal
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 hidden sm:block">
                Department of Revenue &amp; Land Records • Govt. of Maharashtra • DILRMP 3.0
              </p>
            </div>
          </Link>
        </div>

        {/* Action Buttons Matching Website Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>WGS-84 EPSG:4326 Mesh</span>
          </div>

          <Link
            href="/check-ownership"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Check 7/12 &amp; RoR</span>
            <span className="sm:hidden">7/12</span>
          </Link>

          <Link
            href="/check-ownership?tab=mutation"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Mutation History</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-400/20"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Portal</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      {/* 3. Full-Page Interactive GIS Map Canvas & Record Panel */}
      <main className="flex-1 min-h-0 w-full relative">
        <CadastralGisViewer isFullPage={true} />
      </main>
    </div>
  );
}
