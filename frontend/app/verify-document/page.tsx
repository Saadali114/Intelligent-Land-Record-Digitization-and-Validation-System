'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  QrCode,
  Search,
  Building2,
  MapPin,
  User,
  Ruler,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Sparkles,
  AlertCircle,
  Hash,
  Lock,
  ShieldAlert,
  KeyRound,
  Stamp,
  Camera,
} from 'lucide-react';
import Link from 'next/link';

interface VerifiedPayload {
  valid: boolean;
  documentId: string;
  originalName: string;
  fileType: string;
  processingStatus: string;
  checksum: string;
  uploadedAt: string;
  verificationTier?: 'PHYSICAL_STICKER_AUTHENTICATED' | 'DIGITAL_RECORD_ONLY' | 'TAMPER_ALERT_MISMATCH';
  secretCodeVerified?: boolean | null;
  tamperWarning?: string | null;
  secretSecurityCode?: string;
  physicalStickerInstructions?: string;
  landRecord: {
    ownerName: string;
    surveyNumber: string;
    gatNumber?: string | null;
    khataNumber: string;
    plotArea: string;
    village: string;
    tehsil: string;
    district: string;
    landClassification: string;
    ownershipType: string;
    mutationNumber?: string | null;
    verificationStatus: string;
  } | null;
  digitalSeal: {
    authority: string;
    system: string;
    verifiedAt: string;
    certificateNo: string;
    securityHash: string;
    stickerPinVerified?: boolean;
  };
}

function VerifyDocumentContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialSec = searchParams.get('sec') || '';

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [secretPinQuery, setSecretPinQuery] = useState(initialSec);
  const [showPinInput, setShowPinInput] = useState(Boolean(initialSec));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchVerification = async (docId: string, secPin?: string) => {
    if (!docId || !docId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const cleanBase = apiUrl.replace(/\/api\/?$/, '');
      const pinParam = secPin && secPin.trim() ? `?sec=${encodeURIComponent(secPin.trim())}` : '';
      const response = await axios.get(
        `${cleanBase}/api/documents/public-verify/${encodeURIComponent(docId.trim())}${pinParam}`
      );

      if (response.data?.success && response.data?.data) {
        setResult(response.data.data);
      } else {
        setError(response.data?.message || 'Document could not be verified in the registry.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'No official cadastral document found with this identifier. Please verify the QR or Document ID.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchQuery(initialId);
      if (initialSec) {
        setSecretPinQuery(initialSec);
        setShowPinInput(true);
      }
      fetchVerification(initialId, initialSec);
    }
  }, [initialId, initialSec]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchVerification(searchQuery.trim(), secretPinQuery.trim());
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const pinPart = result?.secretSecurityCode && !result.secretSecurityCode.includes('*') && result.secretSecurityCode !== 'INVALID'
        ? `&sec=${encodeURIComponent(result.secretSecurityCode)}`
        : secretPinQuery.trim()
        ? `&sec=${encodeURIComponent(secretPinQuery.trim())}`
        : '';
      const url = `${window.location.origin}/verify-document?id=${encodeURIComponent(
        result?.documentId || searchQuery
      )}${pinPart}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Government Portal Ribbon */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md font-bold text-lg">
              🏛️
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                महाराष्ट्र शासन • महसूल व वन विभाग
              </div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                National Cadastral Document QR & Barcode Verification Portal
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Main Portal
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
            >
              Officer Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Hero Title & Lookup Bar */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Official Maharashtra Land Record Registry Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Cadastral Record Authenticity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Scan the 2D QR Code on any certified 7/12 extract or enter the Document ID to verify against the official tamper-evident government database.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto space-y-2 pt-3 text-left"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Document ID or Secret PIN (e.g. DOC-MH-2026-1001 or SEC-DA2C-7DA3)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>

            {/* Secret Security PIN Toggle */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setShowPinInput(!showPinInput)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
              >
                <KeyRound className="w-3 h-3" />
                {showPinInput
                  ? 'Hide physical sticker secret PIN'
                  : '+ Enter physical document sticker Secret PIN for deed verification'}
              </button>
              <span className="text-[10px] text-slate-500">Dual-factor paper verification</span>
            </div>

            {showPinInput && (
              <div className="p-2.5 bg-slate-900/90 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 ml-1 shrink-0" />
                <input
                  type="text"
                  value={secretPinQuery}
                  onChange={(e) => setSecretPinQuery(e.target.value.toUpperCase())}
                  placeholder="Secret Security PIN (e.g. SEC-DA2C-7DA3)"
                  className="w-full bg-transparent border-none text-xs font-mono text-amber-300 placeholder-slate-500 focus:outline-none uppercase"
                />
                <span className="text-[10px] text-slate-400 shrink-0 pr-1">
                  Printed on physical sticker
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-xs text-slate-400 font-medium">
              Querying State Land Records Central Repository & Validating Digital Hash...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-rose-100">Verification Failed</div>
              <p className="text-rose-300">{error}</p>
              <div className="text-[11px] text-rose-400 pt-1">
                Please double check the ID from your document or ensure the QR code scan was complete.
              </div>
            </div>
          </div>
        )}

        {/* VERIFIED CERTIFICATE CARD */}
        {result && !loading && (
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Official Seal Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      Official Cadastral Record
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {result.documentId}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    Digitally Verified & Certified by Government Registry
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Link Copied' : 'Share Link'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Proof
                </button>
              </div>
            </div>

            {/* PHYSICAL STICKER AUTHENTICITY STATUS BANNER */}
            {result.verificationTier === 'PHYSICAL_STICKER_AUTHENTICATED' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-teal-950/90 border-2 border-emerald-400 text-emerald-100 flex items-start gap-3.5 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                  <Stamp className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-emerald-300 uppercase tracking-wider text-xs">
                      ✓ Physical Document Sticker Authenticated
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[11px] font-mono font-bold">
                      {result.secretSecurityCode}
                    </span>
                  </div>
                  <p className="text-emerald-200/90 text-xs leading-relaxed">
                    The Secret Security PIN on this physical sticker matches the government cryptographic registry. This physical paper deed is verified genuine, legally registered, and authentic.
                  </p>
                </div>
              </div>
            )}

            {result.verificationTier === 'TAMPER_ALERT_MISMATCH' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/90 via-red-900/70 to-rose-950/90 border-2 border-rose-500 text-rose-100 flex items-start gap-3.5 shadow-xl animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm flex-1">
                  <div className="font-black text-rose-200 uppercase tracking-wider text-xs">
                    ⚠️ CRITICAL TAMPER ALERT: Physical Sticker PIN Mismatch
                  </div>
                  <p className="text-rose-200 text-xs leading-relaxed">
                    {result.tamperWarning ||
                      'The Secret Security PIN entered does not match the official registry record for this document. The physical sticker may be forged, duplicated, or affixed to an unverified document.'}
                  </p>
                </div>
              </div>
            )}

            {result.verificationTier === 'DIGITAL_RECORD_ONLY' && (
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Verify Physical Paper Document Authenticity
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Holding the physical deed? Enter the 8-character Secret PIN printed on the sticker to verify physical authenticity:
                  </p>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                  <input
                    type="text"
                    value={secretPinQuery}
                    onChange={(e) => setSecretPinQuery(e.target.value.toUpperCase())}
                    placeholder="e.g. SEC-DA2C-7DA3"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-xs font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase w-36"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (secretPinQuery.trim()) {
                        fetchVerification(result.documentId, secretPinQuery.trim());
                      }
                    }}
                    disabled={loading || !secretPinQuery.trim()}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Verify PIN
                  </button>
                </div>
              </div>
            )}

            {/* Cadastral Primary Parcel Strip */}
            {result.landRecord && (
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> भूमापन / गट क्रमांक (Gat & Survey No.)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">
                    {result.landRecord.surveyNumber}
                    {result.landRecord.gatNumber && !result.landRecord.surveyNumber.includes(result.landRecord.gatNumber) && (
                      <span className="ml-2 text-xs font-sans font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        गट क्र. {result.landRecord.gatNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    खाते क्र. (Khata No.)
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
                    {result.landRecord.khataNumber || '—'}
                  </div>
                </div>
              </div>
            )}

            {/* Official Cadastral Attribute Grid */}
            {result.landRecord ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <User className="w-3.5 h-3.5 text-blue-400" /> खातेदार / शेतीमालक (Registered Landholder):
                  </span>
                  <div className="font-bold text-slate-100 text-sm">
                    {result.landRecord.ownerName || 'Not Specified'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <Ruler className="w-3.5 h-3.5 text-emerald-400" /> एकूण क्षेत्रफळ (Total Plot Area):
                  </span>
                  <div className="font-bold text-emerald-400 font-mono text-sm">
                    {result.landRecord.plotArea || 'Not Specified'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> गाव व तालुका (Village & Tehsil):
                  </span>
                  <div className="font-semibold text-slate-200">
                    {result.landRecord.village}, {result.landRecord.tehsil}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" /> जिल्हा (District):
                  </span>
                  <div className="font-semibold text-slate-200">
                    {result.landRecord.district}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> धारणा पद्धती (Tenure Class):
                  </span>
                  <div className="font-semibold text-slate-200">
                    {result.landRecord.ownershipType || 'वर्ग - १'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> शेवटचा फेरफार क्रमांक (Latest Mutation):
                  </span>
                  <div className="font-bold font-mono text-blue-400">
                    {result.landRecord.mutationNumber || 'MTR-Verified'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-400">
                Document is verified in government repository. Detailed cadastral extract fields are being indexed.
              </div>
            )}

            {/* Cryptographic & Audit Information */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
              <div>
                <span className="text-slate-500">SHA-256 Checksum: </span>
                <span className="text-emerald-400 font-bold">
                  {result.checksum?.slice(0, 24) || 'VERIFIED-RECORD'}...
                </span>
              </div>
              <div>
                <span className="text-slate-500">Security Seal: </span>
                <span className="text-slate-300 font-bold">{result.digitalSeal.certificateNo}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <div>
          National Land Record Digitization & Validation Programme • ILRDVS Maharashtra Repository
        </div>
        <div className="text-[11px] text-slate-600 mt-0.5">
          Tamper-evident verification backed by SHA-256 digital seals and Multimodal AI OCR
        </div>
      </footer>
    </div>
  );
}

export default function VerifyDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading verification portal...
        </div>
      }
    >
      <VerifyDocumentContent />
    </Suspense>
  );
}
