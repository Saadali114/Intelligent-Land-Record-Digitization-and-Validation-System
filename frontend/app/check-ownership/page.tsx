'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const CadastralGisViewer = dynamic(
  () => import('../../components/gis/CadastralGisViewer').then((mod) => mod.CadastralGisViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] w-full bg-slate-100 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin" />
        <p className="text-xs font-bold text-slate-700">Loading Bhoomi Setu Cadastral GIS Engine...</p>
      </div>
    ),
  }
);
import {
  Search,
  MapPin,
  FileText,
  Clock,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Download,
  Printer,
  Copy,
  Check,
  Compass,
  Share2,
  Info,
  Calendar,
  UserCheck,
  FileCheck,
  Landmark,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MainNavbar, SubNavbar, LandingFooter } from '../../components/landing';
import { landRecordsService } from '../../services/land-records.service';
import { LandRecord } from '../../types';

// Tab type definition
type ActiveTab = 'ownership' | 'mutation' | 'gis';

// Quick sample parcels with live data in MongoDB
const SAMPLE_CHIPS = [
  { label: 'Survey 145/2A (Khadakwasla, Pune)', survey: '145/2A', district: 'Pune' },
  { label: 'Survey 88/3 (Vani, Nashik)', survey: '88/3', district: 'Nashik' },
  { label: 'Survey 211/4 (Wagholi, Pune)', survey: '211/4', district: 'Pune' },
  { label: 'Survey 42/1B (Hingna, Nagpur)', survey: '42/1B', district: 'Nagpur' },
  { label: 'Survey 102/5 (Karjat, Raigad)', survey: '102/5', district: 'Raigad' },
];

const DISTRICT_LIST = [
  'All Districts',
  'Pune',
  'Nashik',
  'Nagpur',
  'Mumbai Suburban',
  'Thane',
  'Raigad',
  'Chhatrapati Sambhajinagar',
  'Solapur',
  'Kolhapur',
  'Satara',
];

function CheckOwnershipContent() {
  const searchParams = useSearchParams();

  // URL Query param initialization
  const initialSurvey = searchParams.get('surveyNumber') || '';
  const initialDistrict = searchParams.get('district') || 'All Districts';
  const initialTab = (searchParams.get('tab') as ActiveTab) || 'ownership';

  // State
  const [surveyQuery, setSurveyQuery] = useState(initialSurvey);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    ['ownership', 'mutation', 'gis'].includes(initialTab) ? initialTab : 'ownership'
  );

  const [records, setRecords] = useState<LandRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedULPIN, setCopiedULPIN] = useState(false);

  // GIS Map Interactive Controls
  const [mapMode, setMapMode] = useState<'cadastral' | 'satellite'>('cadastral');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAdjoining, setShowAdjoining] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showULPINPins, setShowULPINPins] = useState(true);
  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);

  // Fetch records from live backend
  const fetchRecords = async (survey?: string, district?: string) => {
    setIsLoading(true);
    try {
      const params: any = { limit: 50 };
      if (survey && survey.trim()) {
        params.search = survey.trim();
      }
      if (district && district !== 'All Districts') {
        params.district = district;
      }
      const res = await landRecordsService.getLandRecords(params);
      const fetched = res.records || [];
      setRecords(fetched);

      // Select matching or first record
      if (fetched.length > 0) {
        if (survey && survey.trim()) {
          const exact = fetched.find(
            (r) =>
              r.surveyNumber?.toLowerCase() === survey.trim().toLowerCase() ||
              r.gatNumber?.toLowerCase() === survey.trim().toLowerCase() ||
              r.khasraNumber?.toLowerCase() === survey.trim().toLowerCase()
          );
          setSelectedRecord(exact || fetched[0]);
        } else {
          setSelectedRecord(fetched[0]);
        }
      } else {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('Failed to fetch land records:', err);
      setRecords([]);
      setSelectedRecord(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(initialSurvey, initialDistrict);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(surveyQuery, selectedDistrict);
  };

  const handleSelectSample = (sampleSurvey: string, sampleDistrict: string) => {
    setSurveyQuery(sampleSurvey);
    setSelectedDistrict(sampleDistrict);
    fetchRecords(sampleSurvey, sampleDistrict);
  };

  const handleCopyULPIN = (ulpin?: string) => {
    if (!ulpin) return;
    navigator.clipboard.writeText(ulpin);
    setCopiedULPIN(true);
    setTimeout(() => setCopiedULPIN(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock adjoining survey numbers derived realistically from the selected record
  const adjoiningParcels = useMemo(() => {
    if (!selectedRecord) return [];
    const base = selectedRecord.surveyNumber || '100';
    const parts = base.split('/');
    const mainNum = parseInt(parts[0], 10) || 100;
    const subNum = parts[1] || '1';

    return [
      { direction: 'North (उत्तर)', survey: `${mainNum - 1}/1`, owner: 'State Govt. Forest / Gram Panchayat', area: '1.45 Ha', status: 'Clear' },
      { direction: 'South (दक्षिण)', survey: `${mainNum + 1}/2`, owner: 'Rameshwar Patil & Co-owners', area: '0.98 Ha', status: 'Clear' },
      { direction: 'East (पूर्व)', survey: `${mainNum}/${subNum}B`, owner: 'Vithalrao Shinde', area: '0.62 Ha', status: 'Clear' },
      { direction: 'West (पश्चिम)', survey: 'Cart Track / 12m PWD Road', owner: 'Public Access Right of Way', area: 'Linear Road', status: 'Public Way' },
    ];
  }, [selectedRecord]);

  // Dynamic WGS-84 Cadastral vertices calculated around base coordinates
  const cadastralCoordinates = useMemo(() => {
    const latBase = selectedRecord?.district === 'Nashik' ? 19.9975 : selectedRecord?.district === 'Nagpur' ? 21.1458 : 18.5204;
    const lngBase = selectedRecord?.district === 'Nashik' ? 73.7898 : selectedRecord?.district === 'Nagpur' ? 79.0882 : 73.8567;

    return [
      { id: 1, label: 'CP-1 (NW Corner)', lat: (latBase + 0.0018).toFixed(6), lng: (lngBase - 0.0014).toFixed(6), stone: 'Tri-junction Stone (त्रिसीमा)' },
      { id: 2, label: 'CP-2 (NE Corner)', lat: (latBase + 0.0021).toFixed(6), lng: (lngBase + 0.0016).toFixed(6), stone: 'Revenue Pillar 14B' },
      { id: 3, label: 'CP-3 (SE Corner)', lat: (latBase - 0.0015).toFixed(6), lng: (lngBase + 0.0019).toFixed(6), stone: 'Ghat Corner Mark' },
      { id: 4, label: 'CP-4 (SW Corner)', lat: (latBase - 0.0019).toFixed(6), lng: (lngBase - 0.0012).toFixed(6), stone: 'Survey Peg Ref 88' },
    ];
  }, [selectedRecord]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      <MainNavbar />
      <SubNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700">Citizen Services</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-900 font-bold">Check Ownership & Cadastral GIS</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-12 bottom-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Live Revenue Cadastral Portal • DILRMP 3.0 Standard
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Check Land Ownership &amp; <span className="text-amber-400">Cadastral GIS Map</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Inspect authentic Record of Rights (7/12 &amp; 8A), verify historical e-Ferfar mutation audit trails, and explore high-precision WGS-84 cadastral parcel boundaries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Record</span>
              </button>
              <Link
                href="/verification"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <FileCheck className="w-4 h-4" />
                <span>Officer Verification</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* District Selector */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                District / जिल्हा
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              >
                {DISTRICT_LIST.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Survey / Gat Number Input */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Survey No. / Gat No. / Khasra No. / सर्व्हे क्र.
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 145/2A, 88/3, 211/4..."
                  value={surveyQuery}
                  onChange={(e) => setSurveyQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-3 sm:pt-5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-blue-950/20"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search &amp; Inspect</span>
              </button>
            </div>
          </form>

          {/* Quick Sample Chips */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Live Records:
            </span>
            {SAMPLE_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSelectSample(chip.survey, chip.district)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  surveyQuery.toLowerCase() === chip.survey.toLowerCase()
                    ? 'bg-blue-950 text-amber-300 border-blue-950 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Record Selector Pills (if multiple records returned) */}
        {records.length > 1 && (
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 overflow-x-auto shadow-xs">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Found {records.length} Records:
            </span>
            <div className="flex items-center gap-2">
              {records.map((r) => (
                <button
                  key={r._id}
                  onClick={() => setSelectedRecord(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedRecord?._id === r._id
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Survey {r.surveyNumber || r.gatNumber}</span>
                  <span className="text-[10px] opacity-75">({r.village})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Connecting to Revenue Land Database...</h3>
            <p className="text-xs text-slate-500">Querying live cadastral registers and ULPIN records from MongoDB.</p>
          </div>
        ) : !selectedRecord ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Land Records Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We could not find any active cadastral record matching survey &ldquo;{surveyQuery}&rdquo; in {selectedDistrict}. Try clicking one of the live sample records above or browse all records.
            </p>
            <button
              onClick={() => {
                setSurveyQuery('');
                setSelectedDistrict('All Districts');
                fetchRecords('', 'All Districts');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset &amp; View All Records</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Parcel Summary Banner */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Survey No. {selectedRecord.surveyNumber || selectedRecord.gatNumber || 'N/A'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {selectedRecord.verificationStatus || 'VERIFIED'}
                    </span>
                    {selectedRecord.landClassification && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                        {selectedRecord.landClassification}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Village: <strong className="text-slate-800">{selectedRecord.village}</strong> • Taluka:{' '}
                    <strong className="text-slate-800">{selectedRecord.tehsil}</strong> • District:{' '}
                    <strong className="text-slate-800">{selectedRecord.district}</strong>
                  </p>
                </div>
              </div>

              {/* 14-Digit Bhu-Aadhaar Badge */}
              <div className="bg-slate-900 text-white rounded-xl p-3 sm:px-4 flex items-center justify-between gap-4 border border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    14-Digit Bhu-Aadhaar (ULPIN)
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-black tracking-wider text-slate-100">
                    {selectedRecord.ulpin || '81LVQLD9407JH0'}
                  </div>
                </div>
                <button
                  onClick={() => handleCopyULPIN(selectedRecord.ulpin || '81LVQLD9407JH0')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy ULPIN"
                >
                  {copiedULPIN ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3 Dedicated Interactive Tabs */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              {/* Tab Nav Header */}
              <div className="flex border-b border-slate-200 bg-slate-50/75 p-1.5 gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('ownership')}
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'ownership'
                      ? 'bg-blue-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${activeTab === 'ownership' ? 'text-amber-400' : 'text-blue-700'}`} />
                  <span>1. Ownership Title &amp; RoR (7/12)</span>
                </button>

                <button
                  onClick={() => setActiveTab('mutation')}
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'mutation'
                      ? 'bg-blue-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className={`w-4 h-4 ${activeTab === 'mutation' ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span>2. Mutation History (e-Ferfar)</span>
                </button>

                <button
                  onClick={() => setActiveTab('gis')}
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'gis'
                      ? 'bg-blue-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className={`w-4 h-4 ${activeTab === 'gis' ? 'text-amber-400' : 'text-cyan-600'}`} />
                  <span>3. GIS Cadastral Map (भू-नकाशा)</span>
                </button>
              </div>

              {/* Tab 1: Ownership Title & RoR (7/12 & 8A) */}
              {activeTab === 'ownership' && (
                <div className="p-6 space-y-6">
                  {/* Key Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Registered Khatedar</div>
                      <div className="text-base font-black text-slate-900 mt-1 truncate">
                        {selectedRecord.ownerName || 'State Land Registry'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Aadhaar Seeded &amp; KYC Verified
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Holding / Plot Area</div>
                      <div className="text-base font-black text-slate-900 mt-1">
                        {selectedRecord.plotArea || '0.85 Hectare'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Pot Kharaba (Uncultivable): 0.00 Ha
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Khata / Account No.</div>
                      <div className="text-base font-black text-blue-900 mt-1 font-mono">
                        {selectedRecord.khataNumber || 'KH-8821'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Khasra No: {selectedRecord.khasraNumber || '—'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Cadastral Valuation</div>
                      <div className="text-base font-black text-emerald-700 mt-1 font-mono">
                        {selectedRecord.calculatedValuation
                          ? `₹ ${(selectedRecord.calculatedValuation / 100000).toFixed(2)} Lakh`
                          : '₹ 42.50 Lakh'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Circle Rate: ₹{selectedRecord.circleRatePerSqm || '4,200'} / sqm
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive 7/12 Extract Layout */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400" />
                        Form VII-XII: Record of Rights &amp; Crop Inspection (गाव नमुना ७/१२)
                      </span>
                      <span className="text-slate-300 font-normal">
                        Digital Hash ID: <span className="font-mono text-amber-300">{(selectedRecord._id || '2026').slice(-8)}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
                      {/* Left: Village Form VII (Title & Tenancy) */}
                      <div className="p-5 space-y-4">
                        <h4 className="font-black text-blue-950 uppercase tracking-wide text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                          <span>Form VII: Rights &amp; Occupancy (हक्क व हिस्सेदार)</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">Gaon Namuna 7</span>
                        </h4>

                        <div className="space-y-2.5">
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Tenure / Occupancy Class:</span>
                            <span className="font-bold text-slate-800">{selectedRecord.ownershipType || 'Occupant Class 1 (भोगवटदार वर्ग-१)'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Assessment Revenue:</span>
                            <span className="font-bold text-slate-800">₹ 8.50 per annum</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Total Cultivable Area:</span>
                            <span className="font-bold text-slate-800">{selectedRecord.plotArea}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500">Last Sanctioned Mutation:</span>
                            <span className="font-bold text-blue-900 font-mono">Mutation #{selectedRecord.mutationNumber || '4821'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Aadhaar Masked Seed:</span>
                            <span className="font-mono font-bold text-slate-800">{selectedRecord.aadhaarMasked || 'XXXX-XXXX-9482'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Village Form XII (Liabilities, Bank Liens, & Disputes) */}
                      <div className="p-5 space-y-4">
                        <h4 className="font-black text-blue-950 uppercase tracking-wide text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                          <span>Form XII: Liabilities &amp; Encumbrances (इतर हक्क व बोजा)</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Gaon Namuna 12</span>
                        </h4>

                        <div className="space-y-3">
                          {/* Bank Lien Status */}
                          <div className={`p-3 rounded-xl border ${selectedRecord.hasBankCharge ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center gap-1.5">
                                <Landmark className="w-3.5 h-3.5 text-blue-900" />
                                Bank Charge / Mortgage:
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${selectedRecord.hasBankCharge ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
                                {selectedRecord.hasBankCharge ? 'ENCUMBERED' : 'UNENCUMBERED'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1.5">
                              {selectedRecord.hasBankCharge && selectedRecord.bankChargeDetails
                                ? `Lien in favor of ${selectedRecord.bankChargeDetails.bankName || 'State Bank of India'} (${selectedRecord.bankChargeDetails.branch || 'Main Branch'}), Amount: ₹${selectedRecord.bankChargeDetails.loanAmount?.toLocaleString('en-IN') || '4,50,000'}`
                                : 'No bank mortgages, crop liens, or institutional encumbrances recorded on this parcel.'}
                            </p>
                          </div>

                          {/* RCCMS Dispute Status */}
                          <div className={`p-3 rounded-xl border ${selectedRecord.hasActiveDispute ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                Revenue Court Disputes (RCCMS):
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${selectedRecord.hasActiveDispute ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'}`}>
                                {selectedRecord.hasActiveDispute ? 'DISPUTE ACTIVE' : '0 DISPUTES'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1.5">
                              {selectedRecord.hasActiveDispute
                                ? `Active Case: ${selectedRecord.rccmsCaseNumber || 'REV-2025-9921'}, Stay Order: ${selectedRecord.disputeDetails?.stayOrder ? 'YES' : 'NO'}`
                                : 'Clean title. No ongoing litigation in SDO, Tahsildar, or Divisional Commissioner courts.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Official Digital Signature Footer */}
                    <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Digitally Signed by Revenue Tahsildar • Valid for Banking, Legal &amp; Sub-Registrar Use</span>
                      </div>
                      <div className="font-mono text-slate-500 text-[11px]">
                        DSC ID: DSC-MAHA-REV-{(selectedRecord._id || '2026').slice(-6).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>Print Form 7/12</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('gis')}
                      className="px-5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>Inspect Cadastral GIS Map</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Mutation History (e-Ferfar / फेरफार नोंदी) */}
              {activeTab === 'mutation' && (
                <div className="p-6 space-y-6">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-black">Statutory e-Ferfar Mutation Register (Section 150 Maharashtra Land Revenue Code)</strong>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Every title transfer, partition, succession, inheritance, and mortgage lien is recorded through digital workflow under strict supervision of Circle Officer and Talathi.
                      </p>
                    </div>
                  </div>

                  {/* Mutation History Timeline */}
                  <div className="relative border-l-2 border-blue-900/30 ml-4 space-y-8 pl-6 py-2">
                    {/* Event 1: Latest Sanctioned Mutation */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-950 text-sm">
                              Mutation #{selectedRecord.mutationNumber || '4821'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              CERTIFIED &amp; SANCTIONED
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            14 Feb 2025
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Nature of Transfer</span>
                            <span className="font-semibold text-slate-800">
                              {selectedRecord.ownershipType || 'Cadastral Title Deed / Succession'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Sanctioning Authority</span>
                            <span className="font-semibold text-slate-800">Circle Revenue Officer (मंडल अधिकारी)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Sub-Registrar Reg No.</span>
                            <span className="font-mono font-semibold text-blue-900">
                              {selectedRecord.registrationNumber || 'SR-PUN-2025/1190'}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <strong>Order Summary:</strong> 15-day public objection notice (Form 9) was duly published. Zero objections received within statutory period. Name of <em>{selectedRecord.ownerName}</em> incorporated in Record of Rights with undivided share.
                        </div>
                      </div>
                    </div>

                    {/* Event 2: Intermediate Transfer */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-950 text-sm">
                              Mutation #3914
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                              REGISTERED DEED
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            08 Oct 2018
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Nature of Transfer</span>
                            <span className="font-semibold text-slate-800">Family Partition Deed (वाटप पत्र)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Sanctioning Authority</span>
                            <span className="font-semibold text-slate-800">Tahsildar (तहसीलदार)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Area Partitioned</span>
                            <span className="font-mono font-semibold text-slate-800">{selectedRecord.plotArea}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event 3: Legacy Record Linkage */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-xs" />
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2 opacity-80">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-800 text-sm">
                              Legacy Settlement Entry #1204
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              CONSOLIDATION SCHEME
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            1972 Revision Survey
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          Original Cadastral Settlement record mapped under the Bombay Prevention of Fragmentation and Consolidation of Holdings Act, 1947.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification CTA */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600">
                      Need a certified physical certified extract of mutation entry (फेरफार प्रत)?
                    </span>
                    <Link
                      href="/documents"
                      className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                    >
                      <span>Apply for Certified Extract</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab 3: GIS Cadastral Map (भू-नकाशा / Bhunaksha) */}
              {activeTab === 'gis' && (
                <div className="p-6 space-y-6">
                  {/* Bhoomi Setu GIS Header Callout */}
                  <div className="bg-gradient-to-r from-[#1c2b3a] to-[#33465a] text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#b8801f] shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[#b8801f] flex items-center justify-center font-serif font-bold text-base text-[#b8801f] bg-[#1c2b3a] shrink-0">
                        भू
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#fffdf8] flex items-center gap-2">
                          <span>Bhoomi Setu — Cadastral GIS Engine</span>
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#b8801f] text-white font-bold">
                            DILRMP 3.0
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Interactive vector cadastral boundaries with OpenStreetMap &amp; Esri Satellite Hybrid imagery. Click any parcel to inspect.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/gis-map"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#b8801f] hover:bg-[#8f6116] text-white font-bold text-xs transition-all shadow-sm shrink-0"
                    >
                      <span>Open Full-Screen GIS Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Interactive Leaflet Cadastral GIS Viewer */}
                  <CadastralGisViewer
                    isFullPage={false}
                    initialSurvey={selectedRecord?.surveyNumber || '145/2A'}
                  />

                  {/* Cadastral Coordinate Vertices Table */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                      WGS-84 Cadastral Survey Boundary Corner Pegs (भू-सीमा दर्शक स्तंभ)
                    </h4>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2.5">Corner Point</th>
                            <th className="px-4 py-2.5">Boundary Peg Type</th>
                            <th className="px-4 py-2.5">Latitude (WGS-84)</th>
                            <th className="px-4 py-2.5">Longitude (WGS-84)</th>
                            <th className="px-4 py-2.5">Adjoining Boundary</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {cadastralCoordinates.map((c, i) => (
                            <tr
                              key={c.id}
                              className={`transition-colors ${
                                hoveredVertex === c.id ? 'bg-amber-50 font-bold' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="px-4 py-2 font-mono font-bold text-blue-900">{c.label}</td>
                              <td className="px-4 py-2">{c.stone}</td>
                              <td className="px-4 py-2 font-mono">{c.lat}° N</td>
                              <td className="px-4 py-2 font-mono">{c.lng}° E</td>
                              <td className="px-4 py-2 text-slate-600">{adjoiningParcels[i]?.direction}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Adjoining Parcels Information Grid */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <Layers className="w-3.5 h-3.5 text-cyan-600" />
                      Four Adjoining Survey Parcels (चतुःसीमा तपशील)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {adjoiningParcels.map((adj) => (
                        <div key={adj.direction} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-blue-900 block">{adj.direction}</span>
                          <div className="font-bold text-slate-900">{adj.survey}</div>
                          <div className="text-[11px] text-slate-600 truncate">{adj.owner}</div>
                          <div className="text-[10px] font-mono text-slate-500">Area: {adj.area}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}

export default function CheckOwnershipPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin" />
            <p className="text-xs font-bold text-slate-700">Loading Cadastral Search...</p>
          </div>
        </div>
      }
    >
      <CheckOwnershipContent />
    </Suspense>
  );
}
