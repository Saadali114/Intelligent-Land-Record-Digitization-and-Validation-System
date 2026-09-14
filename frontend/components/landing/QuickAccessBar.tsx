'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Compass,
  TrendingUp,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const QuickAccessBar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [district, setDistrict] = useState('Pune');
  const [surveyNumber, setSurveyNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (surveyNumber.trim()) query.set('surveyNumber', surveyNumber.trim());
    if (district) query.set('district', district);
    router.push(`/check-ownership?${query.toString()}`);
  };

  const sampleSurveys = [
    { label: 'Survey 145/2A', village: 'Khadakwasla', district: 'Pune', survey: '145/2A' },
    { label: 'Survey 88/3', village: 'Vani', district: 'Nashik', survey: '88/3' },
    { label: 'Survey 211/4', village: 'Wagholi', district: 'Pune', survey: '211/4' },
  ];

  return (
    <div className="relative z-20 -mt-8 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Bar: Search by Survey Number */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-5 sm:p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Cadastral Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Check Land Ownership & Cadastral GIS Map
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter your Survey Number / Gat Number to verify registered Khatedar, view Mutation History, and inspect the geo-referenced GIS parcel boundary.
              </p>
            </div>

            {/* Quick Sample Links */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Quick Samples:</span>
              {sampleSurveys.map((s) => (
                <button
                  key={s.survey}
                  type="button"
                  onClick={() => {
                    setDistrict(s.district);
                    setSurveyNumber(s.survey);
                    router.push(`/check-ownership?surveyNumber=${encodeURIComponent(s.survey)}&district=${encodeURIComponent(s.district)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400 transition-all font-mono text-[11px] cursor-pointer"
                >
                  {s.label} ({s.village})
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-4">
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Select District / जिल्हा
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Districts</option>
                <option value="Pune">Pune (पुणे)</option>
                <option value="Nashik">Nashik (नाशिक)</option>
                <option value="Thane">Thane (ठाणे)</option>
                <option value="Nagpur">Nagpur (नागपूर)</option>
                <option value="Aurangabad">Chhatrapati Sambhajinagar</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Survey / Gat No. / ULPIN / सर्व्हे / गट क्र.
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 145/2A, 88/3, 211/4 or 14-digit ULPIN"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer h-[41px]"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Search & Inspect</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Bar: 3 Core Direct Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50">
          {/* Card 1: Check Ownership */}
          <Link
            href="/check-ownership"
            className="p-5 sm:p-6 flex items-start gap-4 hover:bg-white transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-blue-900 group-hover:text-amber-400 transition-all shadow-xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-950 transition-colors">
                  Check Ownership by Survey No.
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lookup registered Khatedar names, survey plot area, land classification, and Bhu-Aadhaar ULPIN.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 group-hover:underline pt-1">
                Verify Title Rights →
              </span>
            </div>
          </Link>

          {/* Card 2: Mutation History */}
          <Link
            href="/check-ownership?tab=mutation"
            className="p-5 sm:p-6 flex items-start gap-4 hover:bg-white transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                  Mutation History (e-Ferfar)
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track chronological chain of title, inheritance transfers, registered sale deeds, and partition notices.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 group-hover:underline pt-1">
                View Mutation Timeline →
              </span>
            </div>
          </Link>

          {/* Card 3: GIS Cadastral Map */}
          <Link
            href="/gis-map"
            className="p-5 sm:p-6 flex items-start gap-4 hover:bg-white transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Cadastral GIS Map (भू-नकाशा)
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore interactive geo-referenced boundary polygons, satellite imagery, and adjacent parcel boundaries.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 group-hover:underline pt-1">
                Launch GIS Viewer →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
