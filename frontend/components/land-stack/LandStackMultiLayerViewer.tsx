import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Building2,
  DollarSign,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Compass,
  RefreshCw,
  Eye,
  EyeOff,
  Scale,
  Sparkles,
} from 'lucide-react';
import { LandRecord, LandStackResponse, LandStackLayer } from '../../types';
import { landRecordsService } from '../../services/land-records.service';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface LandStackMultiLayerViewerProps {
  record: LandRecord;
  onOpenAadhaarSeeding?: () => void;
  onOpenPropertyCard?: () => void;
}

export const LandStackMultiLayerViewer: React.FC<LandStackMultiLayerViewerProps> = ({
  record,
  onOpenAadhaarSeeding,
  onOpenPropertyCard,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [stackData, setStackData] = useState<LandStackResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    LAYER_1_CADASTRAL: true,
    LAYER_2_ROR: true,
    LAYER_3_REGISTRATION: true,
    LAYER_4_LAND_USE: true,
    LAYER_5_URBAN_NAKSHA: false,
    LAYER_6_BANK_CHARGE: true,
    LAYER_7_RCCMS: true,
    LAYER_8_VALUATION: true,
  });
  const [selectedLayer, setSelectedLayer] = useState<string>('LAYER_1_CADASTRAL');

  useEffect(() => {
    if (record?._id) {
      loadLandStack();
    }
  }, [record?._id]);

  const loadLandStack = async () => {
    try {
      setLoading(true);
      const data = await landRecordsService.getLandStack(record._id);
      setStackData(data);
    } catch (err) {
      console.error('Failed to load land stack:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyULPIN = () => {
    const ulpin = stackData?.ulpin || record.ulpin || '81LVQLD9407JH0';
    navigator.clipboard.writeText(ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const layerIcons: Record<string, React.ReactNode> = {
    LAYER_1_CADASTRAL: <Compass className="w-4 h-4 text-emerald-600" />,
    LAYER_2_ROR: <FileText className="w-4 h-4 text-blue-600" />,
    LAYER_3_REGISTRATION: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
    LAYER_4_LAND_USE: <Layers className="w-4 h-4 text-teal-600" />,
    LAYER_5_URBAN_NAKSHA: <Building2 className="w-4 h-4 text-purple-600" />,
    LAYER_6_BANK_CHARGE: <Lock className="w-4 h-4 text-amber-600" />,
    LAYER_7_RCCMS: <Scale className="w-4 h-4 text-rose-600" />,
    LAYER_8_VALUATION: <DollarSign className="w-4 h-4 text-emerald-700" />,
  };

  const ulpinDisplay = stackData?.ulpin || record.ulpin || '81LVQLD9407JH0';
  const hasDispute = stackData?.disputes?.hasActiveDispute ?? record.hasActiveDispute;
  const hasBankCharge = stackData?.bankCharge?.hasBankCharge ?? record.hasBankCharge;
  const isAadhaarSeeded = record.isAadhaarSeeded;

  return (
    <div className="space-y-4">
      {/* Top Banner: DILRMP 3.0 Bhu-Aadhaar Identification Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 text-white shadow-md border border-slate-700">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                DILRMP 3.0 Land Stack
              </span>
              <span className="text-slate-400 text-xs">Govt. of India Standard</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
                Bhu-Aadhaar (ULPIN):
              </span>
              <span className="font-mono text-base sm:text-lg font-extrabold text-amber-300 tracking-wider bg-slate-950/60 px-2.5 py-0.5 rounded border border-amber-400/30">
                {ulpinDisplay}
              </span>
              <button
                onClick={copyULPIN}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Copy 14-digit ULPIN"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenAadhaarSeeding && (
              <Button
                variant={isAadhaarSeeded ? 'outline' : 'primary'}
                size="sm"
                onClick={onOpenAadhaarSeeding}
                className={`text-xs ${
                  isAadhaarSeeded
                    ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {isAadhaarSeeded ? 'Aadhaar Seeded' : 'Seed Aadhaar'}
              </Button>
            )}

            {onOpenPropertyCard && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenPropertyCard}
                className="text-xs border-indigo-400/40 text-indigo-200 bg-indigo-950/30 hover:bg-indigo-900/40"
              >
                <Building2 className="w-3.5 h-3.5 mr-1" />
                NAKSHA Property Card
              </Button>
            )}

            <button
              onClick={loadLandStack}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Refresh Live Stack"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Parcel metadata summary strip */}
        <div className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase">Owner:</span>
            <p className="font-semibold text-white truncate">{record.ownerName}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase">Survey / Gat:</span>
            <p className="font-semibold text-white">{record.surveyNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase">Area / Class:</span>
            <p className="font-semibold text-emerald-300">{record.plotArea}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase">Jurisdiction:</span>
            <p className="font-semibold text-white truncate">{record.village}, {record.district}</p>
          </div>
        </div>
      </div>

      {/* Flag Banners: Disputes & Bank Charges */}
      <div className="space-y-2">
        {hasDispute && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-950 uppercase tracking-wide">
                  RCCMS Active Revenue Court Dispute Detected
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold">
                  {stackData?.disputes?.rccmsCaseNumber || record.rccmsCaseNumber || 'ACTIVE CASE'}
                </span>
              </div>
              <p className="mt-0.5 text-rose-800">
                {record.disputeDetails?.caseType || 'Contested title or demarcation appeal currently pending before the Sub-Divisional Officer.'}
                {record.disputeDetails?.stayOrder && ' (Stay order in effect - mutations restricted)'}
              </p>
            </div>
          </div>
        )}

        {hasBankCharge && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-950 uppercase tracking-wide">
                  Unified Lending Interface (ULI) Mortgage Lien Registered
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                  ACTIVE LIEN
                </span>
              </div>
              <p className="mt-0.5 text-amber-800">
                {record.bankChargeDetails?.bankName || 'Scheduled Commercial Bank'} • 
                Loan Amount: ₹{(record.bankChargeDetails?.loanAmount || 450000).toLocaleString('en-IN')} • 
                Charge Type: {record.bankChargeDetails?.chargeType || 'Agricultural Hypothecation'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Grid: GIS Visualizer & 8 Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 8 Layers Selector */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              8 Core Land Stack Layers
            </span>
            <span className="text-[11px] text-slate-500">Click to inspect</span>
          </div>

          <div className="space-y-1.5">
            {stackData?.layers.map((layer) => {
              const isEnabled = activeLayers[layer.layerId];
              const isSelected = selectedLayer === layer.layerId;

              return (
                <div
                  key={layer.layerId}
                  onClick={() => setSelectedLayer(layer.layerId)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-white transition border border-slate-200">
                      {layerIcons[layer.layerId] || <Layers className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {layer.layerName}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            layer.status === 'FLAGGED'
                              ? 'bg-rose-100 text-rose-700'
                              : layer.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {layer.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{layer.authority}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayer(layer.layerId);
                    }}
                    className={`p-1.5 rounded hover:bg-slate-200 transition ${
                      isEnabled ? 'text-indigo-600' : 'text-slate-300'
                    }`}
                    title={isEnabled ? 'Hide layer on GIS canvas' : 'Show layer on GIS canvas'}
                  >
                    {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: GIS Canvas Simulation & Selected Layer Inspector */}
        <div className="lg:col-span-7 space-y-3">
          {/* Simulated Cadastral Map View */}
          <div className="relative rounded-xl border border-slate-300 bg-slate-900 overflow-hidden shadow-inner h-64 flex flex-col justify-between p-3">
            {/* Grid Pattern overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0f172a 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Interactive SVG Cadastral Polygon */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <svg viewBox="0 0 400 240" className="w-full h-full max-w-sm drop-shadow-xl">
                <defs>
                  <linearGradient id="parcelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
                  </linearGradient>
                  <pattern id="disputeHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="2" />
                  </pattern>
                </defs>

                {/* Base Cadastral Boundary */}
                {activeLayers.LAYER_1_CADASTRAL && (
                  <polygon
                    points="60,40 330,30 360,190 220,210 70,180"
                    fill="url(#parcelGrad)"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray={activeLayers.LAYER_1_CADASTRAL ? 'none' : '4,4'}
                  />
                )}

                {/* Dispute Overlay */}
                {hasDispute && activeLayers.LAYER_7_RCCMS && (
                  <polygon
                    points="220,70 330,30 360,190 270,180"
                    fill="url(#disputeHatch)"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                )}

                {/* Cadastral Corner Pins */}
                <circle cx="60" cy="40" r="4" fill="#38bdf8" />
                <circle cx="330" cy="30" r="4" fill="#38bdf8" />
                <circle cx="360" cy="190" r="4" fill="#38bdf8" />
                <circle cx="220" cy="210" r="4" fill="#38bdf8" />
                <circle cx="70" cy="180" r="4" fill="#38bdf8" />

                {/* Center Label */}
                <text x="180" y="110" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Survey No. {record.surveyNumber}
                </text>
                <text x="180" y="126" fill="#6ee7b7" fontSize="9" textAnchor="middle">
                  {record.plotArea}
                </text>
                <text x="180" y="142" fill="#94a3b8" fontSize="8" textAnchor="middle">
                  ULPIN: {ulpinDisplay}
                </text>
              </svg>
            </div>

            {/* GIS Top Status Bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700">
              <span className="flex items-center gap-1.5 font-medium">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                WGS-84 Cadastral Geo-Coordinates
              </span>
              <span className="font-mono text-[10px] text-amber-300">
                18.5204° N, 73.8567° E
              </span>
            </div>

            {/* GIS Bottom Legend Bar */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cadastral
                </span>
                {hasDispute && (
                  <span className="flex items-center gap-1 text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Contested
                  </span>
                )}
                {hasBankCharge && (
                  <span className="flex items-center gap-1 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Mortgage
                  </span>
                )}
              </div>
              <span className="text-slate-400">Scale 1:2000</span>
            </div>
          </div>

          {/* Selected Layer Inspection Card */}
          {(() => {
            const currentLayer = stackData?.layers.find((l) => l.layerId === selectedLayer);
            if (!currentLayer) return null;

            return (
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-white border border-slate-200">
                      {layerIcons[currentLayer.layerId]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{currentLayer.layerName}</h4>
                      <p className="text-[10px] text-slate-500">{currentLayer.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {currentLayer.authority}
                  </span>
                </div>

                {/* Layer specific metadata view */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {Object.entries(currentLayer.data).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) return null;
                    return (
                      <div key={key} className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs truncate block">
                          {String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
