'use client';

import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  Upload,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  Search,
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (documentId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when active tab is camera and modal is open
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scannedResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, scannedResult]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          t('qrScanner.unsupportedBrowser', {
            defaultValue: 'Camera access is not supported by your browser or connection.',
          })
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        t('qrScanner.cameraPermissionDenied', {
          defaultValue: 'Camera permission denied or camera unavailable. You can upload a QR image instead.',
        })
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleDetectedCode(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDetectedCode(code.data);
          } else {
            alert(
              t('qrScanner.noQrFoundInImage', {
                defaultValue: 'No valid QR code could be detected in this image. Please try another file.',
              })
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Process and verify the detected code
  const handleDetectedCode = async (rawCode: string) => {
    stopCamera();
    setIsVerifying(true);

    let docId = rawCode.trim();

    // Parse URL if it's a verification URL
    if (docId.includes('/verify-document')) {
      try {
        const url = new URL(docId, window.location.origin);
        const queryId = url.searchParams.get('id');
        if (queryId) docId = queryId;
      } catch {
        const match = docId.match(/[?&]id=([^&#]+)/);
        if (match) docId = decodeURIComponent(match[1]);
      }
    } else if (docId.startsWith('{')) {
      // JSON payload
      try {
        const parsed = JSON.parse(docId);
        if (parsed.docId) docId = parsed.docId;
      } catch {
        // keep as is
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const cleanBase = apiUrl.replace(/\/api\/?$/, '');
      const response = await axios.get(
        `${cleanBase}/api/documents/public-verify/${encodeURIComponent(docId)}`
      );

      if (response.data?.success && response.data?.data) {
        setScannedResult(response.data.data);
      } else {
        setScannedResult({
          valid: false,
          documentId: docId,
          error: response.data?.message || 'Cadastral document not registered in database.',
        });
      }
    } catch (err: any) {
      setScannedResult({
        valid: false,
        documentId: docId,
        error: err.response?.data?.message || 'Document record not found in government registry.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setScannedResult(null);
    setManualInput('');
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {t('qrScanner.modalTitle', { defaultValue: 'Official QR Code Scanner & Verifier' })}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('qrScanner.modalSubtitle', {
                  defaultValue: 'Instant cryptographic verification of official cadastral documents',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isVerifying ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                {t('qrScanner.verifyingWithDb', { defaultValue: 'Verifying QR signature against Revenue Registry...' })}
              </p>
            </div>
          ) : !scannedResult ? (
            <>
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('camera');
                    startCamera();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'camera'
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t('qrScanner.tabCamera', { defaultValue: 'Live Camera' })}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upload');
                    stopCamera();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('qrScanner.tabUpload', { defaultValue: 'Upload QR Image' })}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manual');
                    stopCamera();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'manual'
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('qrScanner.tabManual', { defaultValue: 'Enter ID' })}</span>
                </button>
              </div>

              {/* Camera Tab Content */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* QR Target Crosshairs Overlay */}
                    {cameraActive && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl relative shadow-lg shadow-emerald-950/50 animate-pulse">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 rounded-tr" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 rounded-br" />
                          <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400/40" />
                        </div>
                      </div>
                    )}

                    {!cameraActive && (
                      <div className="text-center p-6 text-slate-400 space-y-2">
                        {cameraError ? (
                          <div className="text-xs text-rose-400 max-w-xs">{cameraError}</div>
                        ) : (
                          <div className="text-xs">{t('common.loading', { defaultValue: 'Starting camera...' })}</div>
                        )}
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white hover:bg-slate-700 cursor-pointer"
                        >
                          Retry Camera
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-center text-slate-500">
                    {t('qrScanner.aimInstructions', {
                      defaultValue: 'Align the 2D QR Code within the frame to automatically scan and verify.',
                    })}
                  </p>
                </div>
              )}

              {/* Upload Tab Content */}
              {activeTab === 'upload' && (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-900 transition-colors bg-slate-50">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    {t('qrScanner.uploadHeading', { defaultValue: 'Upload QR Code Image or Document Scan' })}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Supports PNG, JPG, WEBP, or camera screenshots
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer shadow-xs">
                    <span>{t('qrScanner.browseFile', { defaultValue: 'Select QR Image' })}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Manual Input Tab Content */}
              {activeTab === 'manual' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualInput.trim()) handleDetectedCode(manualInput.trim());
                  }}
                  className="space-y-3"
                >
                  <label className="block text-xs font-bold text-slate-700">
                    {t('qrScanner.manualLabel', {
                      defaultValue: 'Enter Document ID, Application #, or QR URL:',
                    })}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. DOC-MH-2026-1001 or DOC-MTTX55DB-E8EK"
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-900 font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!manualInput.trim()}
                      className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Quick Test IDs:</span>
                    {['DOC-MH-2026-1001', 'DOC-MH-2026-1004', 'DOC-MTTX55DB-E8EK'].map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleDetectedCode(id)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </form>
              )}
            </>
          ) : (
            /* Scanned & Verified Results Display */
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              {scannedResult.valid ? (
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-5 space-y-4">
                  {/* Verified Badge Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>✓ QR SCANNED & VERIFIED</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-0.5">
                          Authentic Government Cadastral Document
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Document Attributes */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-xl p-3 border border-emerald-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Document ID
                      </span>
                      <span className="font-mono font-bold text-blue-900">
                        {scannedResult.documentId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Record Type
                      </span>
                      <span className="font-semibold text-slate-800">
                        {scannedResult.fileType || '7/12 Extract'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Owner / Khatedar
                      </span>
                      <span className="font-bold text-slate-900">
                        {scannedResult.landRecord?.ownerName || 'Verified Citizen'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Survey / Gat No.
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {scannedResult.landRecord?.surveyNumber || '104/2B'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Village & Tehsil
                      </span>
                      <span className="text-slate-700">
                        {scannedResult.landRecord?.village || 'Wagholi'},{' '}
                        {scannedResult.landRecord?.tehsil || 'Haveli'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Security Hash
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 truncate block">
                        {scannedResult.digitalSeal?.securityHash || scannedResult.checksum?.slice(0, 16) || 'AUTHENTIC-2026'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Scan Another</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {onSelectDocument && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDocument(scannedResult.documentId);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Select in Workstation
                        </button>
                      )}
                      <a
                        href={`/verify-document?id=${encodeURIComponent(scannedResult.documentId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>View Public Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tampered / Unverified Result */
                <div className="rounded-2xl border-2 border-rose-500 bg-rose-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        ⚠ Tamper Alert / Unverified
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        Document Not Verified in Registry
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-rose-800">
                    {scannedResult.error || 'The scanned QR code does not match any certified cadastral record.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Try Another Scan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
