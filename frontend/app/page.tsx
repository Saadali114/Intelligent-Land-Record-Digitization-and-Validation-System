'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  FileCheck2,
  Building2,
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Official Top Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="font-semibold text-amber-400">GOVERNMENT OF INDIA &bull; DIGITAL LAND REGISTRY</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Revenue & Land Records Modernization Initiative
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Intelligent Land Record Digitization
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Validation & Governance Portal (ILRDVS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm" className="shadow-md">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm" className="shadow-md">
                  Official Portal Login <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/60 border border-blue-600/40 text-xs font-semibold text-blue-200 mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Next-Gen Digital Governance Architecture
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Modernizing Historical Indian Land Records with Verified Precision
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Converting archived handwritten registers, 7/12 extracts, and mutation entries into
            structured, tamper-evident digital records with human-in-the-loop validation.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={isAuthenticated ? '/dashboard' : '/login'}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 shadow-lg shadow-amber-500/20">
                Launch System Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/land-records">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:border-slate-600"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Land Registry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 flex-1">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-slate-900">Comprehensive Governance Stack</h3>
          <p className="text-sm text-slate-500 mt-2">
            Built for district revenue offices, settlement commissioners, and public transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gov-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Multilingual Archival Ingestion
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured schemas supporting Marathi, Hindi, and English legal records. Preserves
                original scans while preparing digital fields for future OCR and machine learning pipelines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              7/12 & Ferfar Document Ready
            </div>
          </div>

          <div className="gov-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Human-in-the-Loop Verification
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A dual-pane workstation allows inspectors and verifiers to review archival documents
                against digitized fields, submit audit remarks, and record approval/correction logs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Immutable Verification Audit Trail
            </div>
          </div>

          <div className="gov-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Enterprise RBAC & Analytics
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Role-based access control for Admins, Officers, Verifiers, and Viewers. Live MongoDB
                aggregation pipelines drive operational charts and status tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              100,000+ Record Scalable Design
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>AI-Powered Intelligent Land Record Digitization & Validation System &bull; Phase 1 Foundation</p>
        <p className="text-[11px] text-slate-400 mt-1">Built with Next.js App Router, Express, TypeScript, and MongoDB</p>
      </footer>
    </div>
  );
}
