'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  Search,
  Download,
  RefreshCw,
  UserPlus,
  Terminal,
  ExternalLink,
  Lock,
  Wifi,
  Sparkles,
  Camera,
  Compass,
  FileCheck2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Policy toggles state
  const [autoFreeze, setAutoFreeze] = useState(true);
  const [dualVerification, setDualVerification] = useState(true);
  const [modiTriage, setModiTriage] = useState(true);

  // 24-Hour Volume Processing Data
  const volumeData = [
    { time: '00:00', deeds: 2100 },
    { time: '03:00', deeds: 1400 },
    { time: '06:00', deeds: 3200 },
    { time: '09:00', deeds: 9800 },
    { time: '12:00', deeds: 12400 },
    { time: '14:30', deeds: 14200 },
    { time: '18:00', deeds: 10800 },
    { time: '21:00', deeds: 6500 },
    { time: '23:59', deeds: 4200 },
  ];

  const divisions = [
    {
      name: 'पुणे (Pune Division)',
      districts: '5 Districts',
      ulpin: '1,248,320',
      progress: 97.6,
      queue: '3,412',
      breach: '16 Alerts',
      breachColor: 'text-amber-800 bg-amber-50 border-amber-200',
      stayOrders: '89 Stay Orders',
    },
    {
      name: 'कोकण (Konkan Division)',
      districts: '7 Districts',
      ulpin: '894,140',
      progress: 96.2,
      queue: '2,890',
      breach: '08 Alerts',
      breachColor: 'text-amber-800 bg-amber-50 border-amber-200',
      stayOrders: '114 Stay Orders',
    },
    {
      name: 'छ. संभाजीनगर (Marathwada)',
      districts: '8 Districts',
      ulpin: '1,480,320',
      progress: 91.4,
      queue: '5,120',
      breach: '32 High Escalations',
      breachColor: 'text-rose-800 bg-rose-50 border-rose-200 font-bold',
      stayOrders: '54 Stay Orders',
    },
    {
      name: 'नाशिक (Nashik Division)',
      districts: '5 Districts',
      ulpin: '1,020,400',
      progress: 95.0,
      queue: '2,110',
      breach: '04 Alerts',
      breachColor: 'text-amber-800 bg-amber-50 border-amber-200',
      stayOrders: '42 Stay Orders',
    },
    {
      name: 'नागपूर (Nagpur Division)',
      districts: '6 Districts',
      ulpin: '912,500',
      progress: 93.8,
      queue: '1,940',
      breach: '09 Alerts',
      breachColor: 'text-amber-800 bg-amber-50 border-amber-200',
      stayOrders: '35 Stay Orders',
    },
    {
      name: 'अमरावती (Amravati Division)',
      districts: '5 Districts',
      ulpin: '782,100',
      progress: 94.1,
      queue: '1,620',
      breach: '05 Alerts',
      breachColor: 'text-amber-800 bg-amber-50 border-amber-200',
      stayOrders: '29 Stay Orders',
    },
  ];

  const filteredDivisions = divisions.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.districts.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTriggerRun = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <AppLayout>
      <div className="space-y-6 select-none">
        {/* ========================================================================= */}
        {/* TOP CONSOLE HEADER                                                        */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="text-[#14532d] font-bold">
                महसूल व भूमी अभिलेख महासंचालनालय
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#14532d] border border-emerald-200 text-[10px] font-bold">
                DILRMP 3.0 National Code Node
              </span>
              <span>•</span>
              <span className="font-mono text-slate-400">Govt. Code: Pun-22 (MahaGov-NIC)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0f2d1e] tracking-tight flex items-baseline gap-2">
              राज्य भू-अभिलेख नियंत्रण कक्ष{' '}
              <span className="text-sm font-sans font-medium text-slate-500">
                (State Administration & Governance Console)
              </span>
            </h1>

            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Centralized governance node for 36 District Revenue Cadastres, high-throughput Modi script OCR verification, SVAMITVA GIS vector syncing, and automated RCCMS stay compliance.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-600" />
              <span>अधिकारी नियुक्ती (Provision Role)</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>ऑडिट लॉग निर्यात (Export)</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerRun}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-75 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>डॅशबोर्ड री-सिंक (Trigger Run)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE SYSTEM STATUS STRIP (4 Pills)                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-500 block">NIC Server Status</span>
                <span className="font-bold text-slate-800">12/12 Node Groups Healthy</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              OK
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-500 block">SVAMITVA Drone GIS Feed</span>
                <span className="font-bold text-slate-800">WGS-84 Cadastral Live</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#14532d] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              2.4 Gbps
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-500 block">Modi Script AI Engine v4.2</span>
                <span className="font-bold text-slate-800">Transformer Ingestion Active</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#14532d] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              98.4% Acc
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <div>
                <span className="text-[10px] text-slate-500 block">RCCMS Court Auto-Freeze</span>
                <span className="font-bold text-slate-800">242 Disputed Parcels Frozen</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 MAIN KPI CARDS                                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Officers */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                प्रशासकीय कर्मचारी (Active Officers)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0f2d1e] font-mono">
                1,428{' '}
                <span className="text-xs font-sans font-medium text-slate-500">
                  36 जिल्हे (Districts)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 border-t border-slate-100 pt-2 font-medium">
              <div>अप्पर जिल्हाधिकारी: <strong className="text-slate-900">842</strong></div>
              <div>मंडळ अधिकारी (Circle): <strong className="text-slate-900">148</strong></div>
              <div>तहसीलदार (Tehsildar): <strong className="text-slate-900">72</strong></div>
              <div>तलाठी (Talathi): <strong className="text-slate-900">374</strong></div>
            </div>
          </div>

          {/* Card 2: Records Ingested */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                डिजिटाइज्ड कार्यभार (Records Ingested)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0f2d1e] font-mono">
                412,850{' '}
                <span className="text-xs font-sans font-bold text-emerald-700">
                  36.8% अचूक
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-2">
              <span>Manual Audit Backlog:</span>
              <span className="font-bold text-emerald-800">98.8% Verified</span>
            </div>
          </div>

          {/* Card 3: RTS SLA */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                फेरफार अनुपालन (15-Day RTS SLA)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0f2d1e] font-mono">
                94.2%{' '}
                <span className="text-xs font-sans font-medium text-slate-500">
                  Avg 4.8 दिवस (Days)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-2">
              <span>Total RTS Sanctions:</span>
              <span className="font-bold text-slate-900">44,912 मंजूर (94%)</span>
            </div>
          </div>

          {/* Card 4: Fraud Guard */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                दोष बार व गैरप्रकार रोख (Fraud Guard)
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
                342{' '}
                <span className="text-xs font-sans font-medium text-slate-500">
                  कुसंडी नोंदवण्या (Frictions)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-2">
              <span>CERSAI Double Mortgages:</span>
              <span className="font-bold text-rose-800">369 Detected</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* AI PIPELINE & GPU CLUSTER MONITORING (2 Columns: 2/3 and 1/3)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: AI Multilingual Pipeline & Volume Area Chart */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  मोडी लिपी व सातबारा डिजिटल प्रक्रिया (AI Multilingual Pipeline)
                </h3>
                <p className="text-xs text-slate-500">
                  Modi Script Transformer 4.2 OCR, LayoutLM Cadastral Segmenter, & Dual Verification Queue
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-[#14532d] font-bold text-xs border border-emerald-300 self-start sm:self-auto">
                <Activity className="w-3 h-3 text-emerald-700" />
                Live Pipeline Queue
              </span>
            </div>

            {/* 4 Pipeline Stages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#f6f8f4] p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">टप्पा 1 (Document Ingestion)</div>
                <div className="font-bold text-slate-900 mt-1">NGDRS & Tippan</div>
                <div className="text-[11px] text-emerald-800 font-mono font-semibold">1,324 deeds/hr</div>
              </div>
              <div className="bg-[#f6f8f4] p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">टप्पा 2 (OCR & NER)</div>
                <div className="font-bold text-slate-900 mt-1">NER & Translator</div>
                <div className="text-[11px] text-emerald-800 font-mono font-semibold">98.4% Confidence</div>
              </div>
              <div className="bg-[#f6f8f4] p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">टप्पा 3 (GIS Vector)</div>
                <div className="font-bold text-slate-900 mt-1">ULPIN & WGS-84</div>
                <div className="text-[11px] text-emerald-800 font-mono font-semibold">328 Parcels/hr</div>
              </div>
              <div className="bg-[#f6f8f4] p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">टप्पा 4 (DSC Stamp)</div>
                <div className="font-bold text-slate-900 mt-1">e-Sign Verifier</div>
                <div className="text-[11px] text-emerald-800 font-mono font-semibold">Zero Rejections</div>
              </div>
            </div>

            {/* 24-Hour Volume Area Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  २४ तासांमधील डेटा संकलन व प्रक्रिया (24-Hour Processing Volume)
                </span>
                <span className="font-mono text-emerald-800 text-[11px]">
                  Peak: 14,200 Deeds/hr at 14:30 IST
                </span>
              </div>

              <div className="h-44 w-full bg-[#f6f8f4] rounded-xl p-2 border border-slate-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="colorDeeds" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#7e9a75" fontSize={10} tickLine={false} />
                    <YAxis stroke="#7e9a75" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#091c06',
                        borderColor: '#15803d',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="deeds"
                      stroke="#15803d"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorDeeds)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub-bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <span className="font-medium">
                अध्यक्ष सचिव: पुणे हवेली / महा. 1424. दोन्ही लिपी सत्यापन यशस्वीरित्या
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#14532d] text-white font-bold text-[10px]">
                Dual Verifier Queue
              </span>
            </div>
          </div>

          {/* Right: GPU Cluster Status */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  GPU क्लस्टर स्थिती
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500">MahaGov NIC Compute Node Infra</p>
            </div>

            {/* Circular Load Indicator */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#dce5d7"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#14532d"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - 0.78)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-slate-900 font-mono">78%</span>
                  <span className="text-[8px] uppercase tracking-wider font-bold text-slate-500">
                    GPU LOAD
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Items */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">A100 Tensor Ingestion Nodes:</span>
                <span className="font-bold text-slate-800 font-mono">12 / 12 Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">OCR Model Memory:</span>
                <span className="font-bold text-slate-800 font-mono">154 GB / 256 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">Cadastral Vectorization Latency:</span>
                <span className="font-bold text-emerald-800 font-mono">42 ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">RTS Transaction Queue:</span>
                <span className="font-bold text-amber-800 font-mono">432 awaiting sign</span>
              </div>
            </div>

            {/* Terminal Logs Action Button */}
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>कमांड कन्सोल उघडा (CLI Logs)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIVISIONAL CADASTRAL GOVERNANCE TABLE                                     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                विभागीय भूकर व फेरफार प्रगती (Divisional Cadastral Governance)
              </h3>
              <p className="text-xs text-slate-500">
                All 6 Maharashtra Administrative Divisions • SVAMITVA ULPIN Generation & RTS Compliance
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="जिल्हा किंवा ULPIN शोधा..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f6f8f4] border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f6f8f4] text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">विभाग (DIVISION)</th>
                  <th className="py-2.5 px-3">एकूण भूखंड (ULPIN)</th>
                  <th className="py-2.5 px-3">डिजिटलायझेशन %</th>
                  <th className="py-2.5 px-3">सक्रिय फेरफार (QUEUE)</th>
                  <th className="py-2.5 px-3">SLA उल्लंघन (BREACH)</th>
                  <th className="py-2.5 px-3">न्यायालयीन स्थगिती (RCCMS)</th>
                  <th className="py-2.5 px-3 text-right">कृती (ACTIONS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDivisions.map((div, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        {div.name}
                      </div>
                      <div className="text-[10px] text-slate-500 ml-3.5">{div.districts}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{div.ulpin}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#14532d] h-full rounded-full"
                            style={{ width: `${div.progress}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 text-[11px] font-mono">
                          {div.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800">{div.queue}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${div.breachColor}`}>
                        {div.breach}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-800 font-semibold text-[11px]">
                      {div.stayOrders}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-[#14532d] font-bold text-[11px] transition-colors border border-slate-200"
                      >
                        तपासा (Inspect)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOWER GRID: AUDIT TRAIL & API GATEWAYS                                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (7 Cols): Audit Trail & RBAC */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  प्रशासन सुरक्षा व क्रियाकलाप लॉग (Audit Trail & RBAC)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time immutable ledger of privileged actions & token authorizations
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 font-mono">
                WORM Level-3
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Event 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      भूखंड गोठवला (RCCMS Court Stay Triggered)
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Parcel MH-PUN-HAV-004128/9B frozen. Case No. RTS/App/4502/2024 at Sub-Divisional Officer Court, Haveli. Transfer blocked.
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      By: System-AutoBot Demon • Doc Ref: CIVIL-STAY-418812
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">11 मिनिटांपूर्वी</span>
              </div>

              {/* Event 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      अधिकार पदोन्नती (Role Elevation Authorized)
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Officer R. K. Kadam (Circle Officer, Baramati) granted dual-signatory verification privileges under MLRC Act Section 44.
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      By: Smt. Priya Deshmukh (Addl. Collector) • DSC Hash: e9a2..40fe
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">18 मिनिटांपूर्वी</span>
              </div>

              {/* Event 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      CERSAI API Gateway Key Rotation
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Scheduled 30-day cryptographic credential cycle completed for Central Registry of Securitisation Asset Reconstruction gateway.
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      By: State IT Directorate Bot • Status: Compliant
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">४ तासांपूर्वी</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-slate-500 font-medium">
                Active Admin Sessions: <strong className="text-slate-900">48 SuperAdmins Logged In</strong>
              </span>
              <button
                type="button"
                className="text-[#14532d] hover:text-[#166534] font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>सर्व नोंदी पहा (Full Audit Trail)</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right (5 Cols): API Gateways & System Policies */}
          <div className="lg:col-span-5 space-y-6">
            {/* API Gateways */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  केंद्रीय API जोडण्या (API Gateways)
                </h3>
                <span className="text-[10px] text-slate-400">Real-time G2G & Financial</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">CERSAI Banking Lien Registry</div>
                    <div className="text-[10px] text-slate-500">Bank Mortgage Auto-Lien Check</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    Online (38ms)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Survey of India SVAMITVA DEPS</div>
                    <div className="text-[10px] text-slate-500">CORS Network Cadastral Sync</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    Real-time (62 WPM)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">RCCMS Revenue Court Case System</div>
                    <div className="text-[10px] text-slate-500">Stay & Dispute Auto-Injunction</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    Sync Active (112)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">e-Mudrank DSC Token Cloud HSM</div>
                    <div className="text-[10px] text-slate-500">Aadhaar XML & Digital Signatures</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    FIPS 140-2 Level 3
                  </span>
                </div>
              </div>
            </div>

            {/* System Policies */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  प्रशासकीय नियम व धोरणे (System Policies)
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">
                      RCCMS न्यायालयाधीन संपत्तीची स्वयं-गोठवणी
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Auto-freeze property mutations on revenue court stay alerts
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoFreeze}
                    onChange={(e) => setAutoFreeze(e.target.checked)}
                    className="w-4 h-4 text-[#14532d] accent-[#14532d] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">
                      ५ एकर पेक्षा जास्त क्षेत्रासाठी दुहेरी तपासणी
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Dual-officer mandate on large parcel verification (&gt;5 Hectare)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dualVerification}
                    onChange={(e) => setDualVerification(e.target.checked)}
                    className="w-4 h-4 text-[#14532d] accent-[#14532d] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">
                      मोडी AI संशयित दस्त मानवीकडे वर्गवारी
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Route OCR confidence &lt; 90% directly to Specialist Verifier
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={modiTriage}
                    onChange={(e) => setModiTriage(e.target.checked)}
                    className="w-4 h-4 text-[#14532d] accent-[#14532d] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CARD: SVAMITVA DRONE & GROUND-TRUTH INGESTION                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-700" />
                स्वामित्व (SVAMITVA) ड्रोन व भू-स्थल पाहणी (Ground-Truth Ingestion)
              </h3>
              <p className="text-xs text-slate-500">
                Cadastral boundary inspection and ortho-mosaic imagery cross-referenced with historic 1954 Tippan sheets
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
              High-Res Orthorectified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Panel 1: Drone Orthomosaic Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#f6f8f4] flex flex-col justify-between">
              <div className="relative h-44 bg-[#ecf4e8] p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  <rect width="300" height="160" fill="#e2ede0" />
                  <path d="M20,20 L120,40 L180,20 L280,50 L270,140 L160,130 L90,150 L20,120 Z" fill="#cbe3c7" stroke="#66915e" strokeWidth="2" />
                  <polygon points="120,40 180,20 210,90 140,100" fill="#15803d" fillOpacity="0.4" stroke="#15803d" strokeWidth="2" />
                  <circle cx="160" cy="60" r="10" fill="#14532d" />
                  <text x="160" y="64" fontSize="9" fill="#ffffff" fontWeight="bold" textAnchor="middle">GAT 45/1</text>
                  <line x1="120" y1="40" x2="280" y2="50" stroke="#b45309" strokeDasharray="3,3" />
                </svg>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[9px] font-mono text-slate-700">
                  Haveli Div-PM-9102 (WGS-84)
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#14532d] text-white text-[9px] font-mono font-bold">
                  ULPIN 27-26-PUN-0042
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-slate-900">
                  पुणे हवेली - ड्रोन ऑर्थो नकाशा (Drone Orthomosaic)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  DGPS rover-validated with 0.8cm horizontal accuracy across 42 boundary corner markers.
                </p>
              </div>
            </div>

            {/* Panel 2: Historic Modi Sanad & Deed */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#f6f8f4] flex flex-col justify-between">
              <div className="relative h-44 bg-[#f3ebd3] p-3 flex flex-col justify-between font-serif">
                <div className="text-[10px] text-amber-900 font-mono">
                  Modi Deed (1908) • OCR 98.4%
                </div>
                <div className="text-center py-2 text-amber-950 font-bold text-sm tracking-widest leading-relaxed opacity-90">
                  𑘦𑘻𑘚𑘲 𑘭𑘡𑘟 — 𑘐𑘨𑘿𑘝 𑘡𑘽. ४५/१ <br />
                  <span className="text-xs font-mono font-normal">
                    [भोगवटादार: मल्हारी बाबाजी देशमुख • क्षेत्र: १.१० हे.]
                  </span>
                </div>
                <div className="text-[9px] text-amber-800/80 font-mono text-right">
                  हवेली दप्तर • बस्तान २८
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-slate-900">
                  ऐतिहासिक मोडी दस्तऐवज (Historic Modi Sanad/Deed)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Automated transliteration to Devanagari and Roman script mapped with modern survey numbers.
                </p>
              </div>
            </div>

            {/* Panel 3: Field Surveyor Ground Truth Inspection Photo */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#f6f8f4] flex flex-col justify-between">
              <div className="relative h-44 bg-[#e9f0e6] p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  <rect width="300" height="160" fill="#2d422a" />
                  <circle cx="150" cy="70" r="30" fill="#4d6e45" />
                  <path d="M110,160 C110,120 190,120 190,160 Z" fill="#233d1b" />
                  <rect x="135" y="60" width="30" height="40" rx="3" fill="#ffffff" />
                  <circle cx="150" cy="50" r="16" fill="#fde68a" />
                  <path d="M135,38 L165,38 L160,32 L140,32 Z" fill="#d97706" />
                  <line x1="70" y1="40" x2="230" y2="40" stroke="#86efac" strokeDasharray="4,4" />
                </svg>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                  Cadastral Surveyor Geo-Tag
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-bold">
                  Verified In-Field
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-slate-900">
                  भू-मापक प्रत्यक्ष पाहणी (Field Surveyor Ground Truth)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Direct geo-tagged Aadhaar-authenticated photo submission from mobile DILRMP FieldApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
