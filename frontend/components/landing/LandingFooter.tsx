'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      data-purpose="portal-footer"
      className="bg-white text-stone-700 text-xs border-t border-stone-200 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Portal Overview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-sovereign-800 flex items-center justify-center text-white font-bold text-sm">
              🏛️
            </div>
            <div>
              <div className="text-sm font-serif font-bold text-stone-900">
                ILRDVS Land Portal
              </div>
              <div className="text-[10px] text-stone-600">
                Government of Maharashtra Revenue Administration
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            An Intelligent, AI-powered Cadastral Digitization &amp; Validation System designed to safeguard, digitize, and authenticate historical land records under the National Land Records Modernization Programme (NLRMP).
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-stone-700">
            <span className="flex items-center space-x-1 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-700">
              <span className="text-emerald-700">🔒</span>
              <span>SSL Encrypted (SHA-256)</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center space-x-1 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-700">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>W3C Compliant</span>
            </span>
          </div>
        </div>

        {/* Quick Nav: Cadastral Services */}
        <div>
          <h4 className="text-stone-900 font-serif font-semibold text-xs uppercase tracking-wider mb-3">
            Cadastral Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/land-records" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Land Records 7/12
              </Link>
            </li>
            <li>
              <Link href="/land-records" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Urban Property Cards (CTS)
              </Link>
            </li>
            <li>
              <Link href="/verification" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Mutation Status (Ferfar 6)
              </Link>
            </li>
            <li>
              <Link href="/land-records" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Digital Village Map (Nakasha)
              </Link>
            </li>
            <li>
              <Link href="#stack" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Bhu-Aadhaar (ULPIN) Search
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Nav: Related Portals */}
        <div>
          <h4 className="text-stone-900 font-serif font-semibold text-xs uppercase tracking-wider mb-3">
            Related Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="https://mahabhumi.gov.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Mahabhumi Portal ↗
              </a>
            </li>
            <li>
              <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Digital India ↗
              </a>
            </li>
            <li>
              <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-700 transition-colors">
                National Portal of India ↗
              </a>
            </li>
            <li>
              <a href="https://svamitva.nic.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-700 transition-colors">
                SVAMITVA Scheme ↗
              </a>
            </li>
            <li>
              <a href="https://igrmaharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-700 transition-colors">
                IGR Maharashtra ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Nav: Policies & Help */}
        <div>
          <h4 className="text-stone-900 font-serif font-semibold text-xs uppercase tracking-wider mb-3">
            Policies &amp; Help
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/documents" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/documents" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Privacy &amp; Data Policy
              </Link>
            </li>
            <li>
              <Link href="/documents" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Hyperlink &amp; Copyright Policy
              </Link>
            </li>
            <li>
              <Link href="/screen-reader" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Accessibility Statement
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-stone-600 hover:text-emerald-700 transition-colors">
                Helpdesk Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Disclaimer */}
      <div className="border-t border-stone-200 bg-white py-4 px-4 sm:px-8 text-[11px] text-stone-500 flex flex-wrap justify-between items-center">
        <div>
          Content Owned, Maintained and Updated by Revenue and Forest Department, Government of Maharashtra.
        </div>
        <div className="mt-2 sm:mt-0">
          Smart India Hackathon GovTech Initiative • © 2026 ILRDVS. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
