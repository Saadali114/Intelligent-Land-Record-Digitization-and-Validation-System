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
