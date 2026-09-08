import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { DocumentRecord, LandRecord } from '../types';

/**
 * Deterministically compute the tamper-evident secret security code for physical document stickers.
 */
export function computeDocumentSecretCode(documentId: string, metadataCode?: string): string {
  if (metadataCode && typeof metadataCode === 'string' && metadataCode.trim()) {
    return metadataCode.trim().toUpperCase();
  }
  const str = `${(documentId || '').toUpperCase().trim()}:ILRDVS-MAHA-SEAL-2026`;
  let h1 = 0xdeadbeef,
    h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
  const part2 = (h2 >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
  return `SEC-${part1}-${part2}`;
}

/**
 * Construct the public verification URL for a given document ID, optionally including the secret code for physical sticker verification.
 */
export function buildVerificationUrl(
  documentId: string,
  customOrigin?: string,
  secretCode?: string
): string {
  const origin =
    customOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://ilrd-frontend.onrender.com');
  const base = `${origin}/verify-document?id=${encodeURIComponent(documentId)}`;
  return secretCode ? `${base}&sec=${encodeURIComponent(secretCode)}` : base;
}

/**
 * Generate a high-density 2D QR Code as a Data URL image (PNG).
 */
export async function generateQrDataUrl(
  content: string,
  options?: { width?: number; margin?: number; darkColor?: string }
): Promise<string> {
  try {
    return await QRCode.toDataURL(content, {
      width: options?.width || 320,
      margin: options?.margin ?? 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: options?.darkColor || '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('[QR-Generator] Failed to generate QR data URL:', error);
    return '';
  }
}

/**
 * Generate a 1D Code 128 Barcode as an SVG string or Data URL.
 */
export function generateBarcodeDataUrl(barcodeText: string): string {
  try {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeText, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 14,
      font: 'monospace',
      lineColor: '#0f172a',
      background: '#ffffff',
      height: 48,
      margin: 6,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('[Barcode-Generator] Failed to generate barcode:', error);
    return '';
  }
}

/**
 * Create a standardized verification payload for cadastral records including physical sticker security PIN.
 */
export function createCadastralVerificationPayload(
  doc: DocumentRecord,
  lr?: LandRecord | null
): {
  secretCode: string;
  verificationUrl: string;
  qrPayloadJson: string;
  barcodeValue: string;
  summaryText: string;
} {
  const secretCode = computeDocumentSecretCode(
    doc.documentId,
    doc.metadata?.securityCode
  );
  const verificationUrl = buildVerificationUrl(doc.documentId, undefined, secretCode);
  const barcodeValue = doc.documentId;

  const payloadObj = {
    docId: doc.documentId,
    sec: secretCode,
    type: doc.fileType || '7/12 Satbara',
    survey: lr?.surveyNumber || 'N/A',
    gat: lr?.gatNumber || undefined,
    khata: lr?.khataNumber || 'N/A',
    owner: lr?.ownerName || 'N/A',
    area: lr?.plotArea || 'N/A',
    village: lr?.village || 'N/A',
    district: lr?.district || 'N/A',
    hash: doc.checksum?.slice(0, 16) || 'VERIFIED',
    url: verificationUrl,
  };

  const summaryText = `GOVT OF MAHARASHTRA • CADASTRAL RECORD
Doc ID: ${doc.documentId}
Secret Security PIN: ${secretCode}
Survey/Gat: ${lr?.surveyNumber || '—'}
Khata: ${lr?.khataNumber || '—'}
Owner: ${lr?.ownerName || '—'}
Area: ${lr?.plotArea || '—'}
Location: ${lr?.village || '—'}, ${lr?.district || '—'}
Verify: ${verificationUrl}`;

  return {
    secretCode,
    verificationUrl,
    qrPayloadJson: JSON.stringify(payloadObj),
    barcodeValue,
    summaryText,
  };
}

/**
 * Generate a complete high-resolution physical adhesive sticker label image on a canvas and download it.
 */
export async function downloadStickerLabelImage(
  doc: DocumentRecord,
  lr?: LandRecord | null
): Promise<void> {
  if (typeof document === 'undefined') return;

  const { secretCode, verificationUrl } = createCadastralVerificationPayload(doc, lr);
  const qrDataUrl = await generateQrDataUrl(verificationUrl, { width: 300, margin: 1 });
  const barcodeDataUrl = generateBarcodeDataUrl(doc.documentId);

  const canvas = document.createElement('canvas');
  const size = 640;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Outer Security Border
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, size - 24, size - 24);

  // Top Guilloche bar
  const grad = ctx.createLinearGradient(12, 12, size - 24, 12);
  grad.addColorStop(0, '#047857');
  grad.addColorStop(0.5, '#10b981');
  grad.addColorStop(1, '#065f46');
  ctx.fillStyle = grad;
  ctx.fillRect(15, 15, size - 30, 8);

  // Header Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('महाराष्ट्र शासन • महसूल विभाग', size / 2, 48);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('CADASTRAL ARCHIVE AUTHENTICITY STICKER', size / 2, 68);

  // Draw QR
  if (qrDataUrl) {
    const qrImg = new Image();
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
      qrImg.src = qrDataUrl;
    });
    const qrSize = 210;
    const qrX = (size - qrSize) / 2;
    ctx.drawImage(qrImg, qrX, 80, qrSize, qrSize);
  }

  // Draw Barcode
  if (barcodeDataUrl) {
    const barImg = new Image();
    await new Promise((resolve) => {
      barImg.onload = resolve;
      barImg.onerror = resolve;
      barImg.src = barcodeDataUrl;
    });
    ctx.drawImage(barImg, (size - 300) / 2, 298, 300, 44);
  }

  // Document ID
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 15px monospace';
  ctx.fillText(doc.documentId, size / 2, 362);

  // Metadata Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(36, 376, size - 72, 86);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 376, size - 72, 86);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`Survey/Gat: ${lr?.surveyNumber || '—'}    |    Khata: ${lr?.khataNumber || '—'}`, 48, 400);
  ctx.fillText(`Owner: ${(lr?.ownerName || 'State Cadastral Archive').slice(0, 36)}`, 48, 424);
  ctx.fillText(`Location: ${lr?.village || '—'}, ${lr?.district || '—'}`, 48, 448);

  // Secret Security PIN badge
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(36, 474, size - 72, 40);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 474, size - 72, 40);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#92400e';
  ctx.font = '900 15px monospace';
  ctx.fillText(`🔒 SECRET SECURITY PIN: ${secretCode}`, size / 2, 500);

  // Footer Instructions
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('PEEL & AFFIX TO PHYSICAL DEED • SCAN WITH CAMERA TO VERIFY', size / 2, 538);

  // Trigger download
  const link = document.createElement('a');
  link.download = `QR-Sticker-Seal-${doc.documentId}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
