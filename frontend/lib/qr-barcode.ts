import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { DocumentRecord, LandRecord } from '../types';

/**
 * Construct the public verification URL for a given document ID.
 */
export function buildVerificationUrl(documentId: string, customOrigin?: string): string {
  const origin =
    customOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://ilrd-frontend.onrender.com');
  return `${origin}/verify-document?id=${encodeURIComponent(documentId)}`;
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
 * Create a standardized verification payload for cadastral records.
 */
export function createCadastralVerificationPayload(
  doc: DocumentRecord,
  lr?: LandRecord | null
): {
  verificationUrl: string;
  qrPayloadJson: string;
  barcodeValue: string;
  summaryText: string;
} {
  const verificationUrl = buildVerificationUrl(doc.documentId);
  const barcodeValue = doc.documentId;

  const payloadObj = {
    docId: doc.documentId,
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
Survey/Gat: ${lr?.surveyNumber || '—'}
Khata: ${lr?.khataNumber || '—'}
Owner: ${lr?.ownerName || '—'}
Area: ${lr?.plotArea || '—'}
Location: ${lr?.village || '—'}, ${lr?.district || '—'}
Verify: ${verificationUrl}`;

  return {
    verificationUrl,
    qrPayloadJson: JSON.stringify(payloadObj),
    barcodeValue,
    summaryText,
  };
}
