import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ExternalLink,
  Shield,
  Heart,
  Lock,
  Globe,
  Award,
} from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Footer Pillars & Portal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Government Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-bold border border-blue-700">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white tracking-tight">
                  ILRDVS Land Portal
                </h4>
                <p className="text-[11px] text-slate-400">
                  Government of India & Maharashtra Revenue Initiative
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An intelligent, AI-powered Cadastral Digitization & Validation System designed to
              safeguard, digitize, and authenticate historical land titles under the National Land
              Records Modernization Programme (NLRMP).
            </p>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Shield className="w-3.5 h-3.5" /> W3C & STQC Compliant
              </span>
            </div>
          </div>

          {/* Col 2: Cadastral Services */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              Land Services
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/land-records" className="hover:text-amber-400 transition-colors">
                  7/12 Satbara Extract
                </Link>
              </li>
              <li>
                <Link href="/land-records" className="hover:text-amber-400 transition-colors">
                  Urban Property Cards (CTS)
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-amber-400 transition-colors">
                  Mutation Register (Ferfar)
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-amber-400 transition-colors">
                  Document Ingestion & OCR
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-amber-400 transition-colors">
                  Inspector Workstation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              Related Portals
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://mahabhumi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>MahaBhumi Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Digital India</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>National Informatics Centre</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal Policies */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-white uppercase tracking-wider">
              Policies & Help
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="#about" className="hover:text-amber-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-amber-400 transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-amber-400 transition-colors">
                  Hyperlink & Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-amber-400 transition-colors">
                  Citizen Grievance Policy
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-amber-400 font-bold hover:underline">
                  Official Employee Login &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-5 px-4 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} Intelligent Land Record Digitization & Validation System (ILRDVS). All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for</span>
            <span className="font-bold text-amber-400">Smart India Hackathon (SIH)</span>
            <span>&bull; Digital Land Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
