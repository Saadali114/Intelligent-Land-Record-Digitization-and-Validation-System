import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DocumentRecord } from '../../types';
import {
  generateQrDataUrl,
  generateBarcodeDataUrl,
  buildVerificationUrl,
} from '../../lib/qr-barcode';
import {
  QrCode,
  Check,
  Copy,
  ExternalLink,
  Download,
  ShieldCheck,
  Building2,
  Fingerprint,
} from 'lucide-react';

interface DocumentQrModalProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentQrModal: React.FC<DocumentQrModalProps> = ({
  document: doc,
  isOpen,
  onClose,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const verificationUrl = doc ? buildVerificationUrl(doc.documentId) : '';

  useEffect(() => {
    if (!doc || !isOpen) return;

    let isMounted = true;
    generateQrDataUrl(verificationUrl, { width: 320, margin: 2 }).then((url) => {
      if (isMounted) setQrUrl(url);
    });

    const bUrl = generateBarcodeDataUrl(doc.documentId);
    if (isMounted) setBarcodeUrl(bUrl);

    return () => {
      isMounted = false;
    };
  }, [doc, isOpen, verificationUrl]);

  if (!doc) return null;

  const handleCopyLink = () => {
    if (verificationUrl) {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = window.document.createElement('a');
    a.href = qrUrl;
    a.download = `QR-Verification-${doc.documentId}.png`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Cadastral QR & Barcode Verification Seal"
      description={`Document ID: ${doc.documentId} • ${doc.fileType || '7/12 Extract'}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Verification Authority Banner */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🏛️
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                महाराष्ट्र शासन • महसूल विभाग
              </div>
              <div className="text-xs font-bold text-slate-800">
                Tamper-Proof Cadastral Seal
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ACTIVE REGISTRY SEAL
          </span>
        </div>

        {/* QR & Barcode Display Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-3 text-center">
          {qrUrl ? (
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-md">
              <img
                src={qrUrl}
                alt="Document Verification QR"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-400">Generating QR...</span>
            </div>
          )}

          {/* Barcode Display */}
          {barcodeUrl && (
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs max-w-xs w-full">
              <img
                src={barcodeUrl}
                alt="Code 128 Barcode"
                className="w-full h-10 object-contain mx-auto"
              />
            </div>
          )}

          <p className="text-[11px] text-slate-500 max-w-sm">
            Scan this 2D QR Code with any smartphone camera or handheld barcode reader to immediately verify authentic land revenue records.
          </p>
        </div>

        {/* Public Verification Link */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Public Verification URL:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value={verificationUrl}
              className="flex-1 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-700 select-all focus:outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 px-3 text-xs shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQr}
            className="text-xs h-8 text-slate-700"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Download QR (PNG)
          </Button>

          <a
            href={verificationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Open Verification Portal
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
