import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DocumentRecord } from '../../types';
import {
  generateQrDataUrl,
  generateBarcodeDataUrl,
  createCadastralVerificationPayload,
} from '../../lib/qr-barcode';
import {
  QrCode,
  Check,
  Copy,
  ExternalLink,
  Download,
  ShieldCheck,
  Printer,
  Stamp,
  Lock,
  Sparkles,
  Layers,
  MapPin,
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
  const [activeTab, setActiveTab] = useState<'sticker' | 'digital'>('sticker');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const stickerRef = useRef<HTMLDivElement>(null);

  const { secretCode, verificationUrl } = useMemo(() => {
    if (!doc) return { secretCode: '', verificationUrl: '' };
    return createCadastralVerificationPayload(doc, doc.landRecord);
  }, [doc]);

  useEffect(() => {
    if (!doc || !isOpen) return;

    let isMounted = true;
    generateQrDataUrl(verificationUrl, { width: 360, margin: 2 }).then((url) => {
      if (isMounted) setQrUrl(url);
    });

    const bUrl = generateBarcodeDataUrl(doc.documentId);
    if (isMounted) setBarcodeUrl(bUrl);

    return () => {
      isMounted = false;
    };
  }, [doc, isOpen, verificationUrl]);

  if (!doc) return null;

  const lr = doc.landRecord;

  const handleCopyLink = () => {
    if (verificationUrl) {
      navigator.clipboard.writeText(verificationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyPin = () => {
    if (secretCode) {
      navigator.clipboard.writeText(secretCode);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2500);
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

  // Direct printing formatted for physical adhesive sticker labels
  const handlePrintSticker = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=750');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sticker Seal - ${doc.documentId}</title>
          <style>
            @page {
              size: 80mm 80mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 6mm;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }
            .sticker-card {
              width: 68mm;
              border: 2px solid #047857;
              border-radius: 6px;
              padding: 2.5mm;
              text-align: center;
              background: #ffffff;
              box-sizing: border-box;
            }
            .header-crest {
              font-size: 8pt;
              font-weight: 800;
              color: #065f46;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              line-height: 1.1;
            }
            .sub-title {
              font-size: 6.5pt;
              color: #475569;
              font-weight: 600;
              margin-bottom: 2mm;
            }
            .qr-image {
              width: 28mm;
              height: 28mm;
              margin: 0 auto;
              display: block;
            }
            .barcode-image {
              width: 58mm;
              height: 7mm;
              object-fit: contain;
              margin: 1.5mm auto 1mm auto;
              display: block;
            }
            .doc-id {
              font-family: monospace;
              font-size: 8pt;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 1.5mm;
            }
            .meta-grid {
              font-size: 6.5pt;
              line-height: 1.3;
              color: #1e293b;
              border-top: 1px dashed #cbd5e1;
              border-bottom: 1px dashed #cbd5e1;
              padding: 1.5mm 0;
              margin: 1.5mm 0;
              text-align: left;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
            }
            .secret-badge {
              background: #fef3c7;
              border: 1px solid #d97706;
              border-radius: 4px;
              padding: 1.5mm;
              margin-top: 1.5mm;
              font-family: monospace;
              font-size: 8pt;
              font-weight: 900;
              color: #92400e;
              letter-spacing: 0.5px;
            }
            .footer-instruction {
              font-size: 5pt;
              color: #64748b;
              font-weight: 700;
              margin-top: 1.5mm;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="sticker-card">
            <div class="header-crest">महाराष्ट्र शासन • महसूल विभाग</div>
            <div class="sub-title">CADASTRAL ARCHIVE AUTHENTICITY STICKER</div>
            
            <img class="qr-image" src="${qrUrl}" alt="QR" />
            <img class="barcode-image" src="${barcodeUrl}" alt="Barcode" />
            <div class="doc-id">${doc.documentId}</div>
            
            <div class="meta-grid">
              <div class="meta-row">
                <span><strong>Survey/Gat:</strong> ${lr?.surveyNumber || '—'}</span>
                <span><strong>Khata:</strong> ${lr?.khataNumber || '—'}</span>
              </div>
              <div class="meta-row">
                <span><strong>Owner:</strong> ${(lr?.ownerName || 'State Land Record').slice(0, 22)}</span>
              </div>
              <div class="meta-row">
                <span><strong>Location:</strong> ${lr?.village || '—'}, ${lr?.district || '—'}</span>
              </div>
            </div>

            <div class="secret-badge">
              SECRET PIN: ${secretCode}
            </div>

            <div class="footer-instruction">
              Affix to original paper document • Scan to verify
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tamper-Proof Document Verification & Adhesive Sticker Seal"
      description={`Document ID: ${doc.documentId} • ${doc.fileType || '7/12 Extract'}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('sticker')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sticker'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stamp className="w-3.5 h-3.5 text-emerald-600" />
            Physical Adhesive Sticker (Print & Stick)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('digital')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'digital'
                ? 'bg-white text-blue-800 shadow-xs border border-blue-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Digital Verification Seal & Details
          </button>
        </div>

        {/* TAB 1: PHYSICAL STICKER LABEL */}
        {activeTab === 'sticker' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Physical Document Security: </span>
                Print this adhesive label and affix it to the original paper document. When officers or citizens scan the sticker, the embedded secret security PIN confirms the physical paper deed is genuine and free from alteration.
              </div>
            </div>

            {/* Visual Sticker Preview */}
            <div className="flex justify-center p-4 bg-slate-100/80 rounded-2xl border border-dashed border-slate-300">
              <div
                ref={stickerRef}
                className="w-80 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl p-4 text-center text-slate-800 space-y-2 relative overflow-hidden"
              >
                {/* Guilloche micro-pattern top border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

                {/* State Emblem & Header */}
                <div>
                  <div className="text-[11px] uppercase font-black tracking-wider text-emerald-800">
                    महाराष्ट्र शासन • महसूल विभाग
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                    Cadastral Authenticity Adhesive Seal
                  </div>
                </div>

                {/* QR Code & Barcode */}
                <div className="flex flex-col items-center justify-center py-1">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="Sticker QR"
                      className="w-36 h-36 object-contain mx-auto rounded-lg border border-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}

                  {barcodeUrl && (
                    <img
                      src={barcodeUrl}
                      alt="Sticker Barcode"
                      className="w-56 h-8 object-contain mx-auto mt-1"
                    />
                  )}
                  <div className="text-[11px] font-black font-mono tracking-wider text-slate-900">
                    {doc.documentId}
                  </div>
                </div>

                {/* Land Record Metadata Summary */}
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-700 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>
                      <strong className="text-slate-900">Survey/Gat:</strong> {lr?.surveyNumber || '—'}
                    </span>
                    <span>
                      <strong className="text-slate-900">Khata:</strong> {lr?.khataNumber || '—'}
                    </span>
                  </div>
                  <div className="truncate">
                    <strong className="text-slate-900">Owner:</strong> {lr?.ownerName || 'State Cadastral Archive'}
                  </div>
                  <div className="truncate">
                    <strong className="text-slate-900">Village:</strong> {lr?.village || '—'}, {lr?.district || '—'}
                  </div>
                </div>

                {/* SECRET SECURITY PIN BADGE */}
                <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-900 font-bold uppercase">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Secret PIN:
                  </div>
                  <div className="font-mono font-black text-xs text-amber-950 tracking-wider">
                    {secretCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="p-1 text-amber-700 hover:text-amber-900 rounded hover:bg-amber-100 transition-colors"
                    title="Copy Secret PIN"
                  >
                    {copiedPin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Bottom Affix Instruction */}
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pt-0.5">
                  Peel & Affix to Original Physical Deed • Scan to Verify
                </div>
              </div>
            </div>

            {/* Sticker Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrintSticker}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Physical Sticker (80mm x 80mm)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQr}
                  className="text-xs h-8 text-slate-700"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Download QR (PNG)
                </Button>
              </div>

              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Test Verification Link
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL VERIFICATION SEAL */}
        {activeTab === 'digital' && (
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

            {/* Secret Security PIN Strip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-bold text-slate-800">Physical Secret PIN</div>
                  <div className="text-[10px] text-slate-500">Decoded during camera or barcode scan</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300 text-xs">
                  {secretCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded border border-slate-200 bg-white"
                  title="Copy Secret PIN"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Public Verification Link */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Public Verification URL (Includes Decoded Secret PIN):
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
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedLink ? 'Copied' : 'Copy'}
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
        )}
      </div>
    </Modal>
  );
};
