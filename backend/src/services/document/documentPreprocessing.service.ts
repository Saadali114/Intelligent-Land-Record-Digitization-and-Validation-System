import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface PreprocessingResult {
  checksum: string;
  fileSize: number;
  mimeType: string;
  isPdf: boolean;
  pageCount: number;
  extractedPdfText?: string;
  preprocessedImageBuffer?: Buffer;
  warnings: string[];
}

export class DocumentPreprocessingService {
  /**
   * Compute SHA-256 checksum of a buffer
   */
  public static computeChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Validate file mime type and size (limit: 10MB)
   */
  public static validateFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): { valid: boolean; error?: string } {
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
    if (fileBuffer.length > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit (Actual: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)`,
      };
    }

    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/tiff',
    ];

    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'];

    if (!allowedMimes.includes(mimeType) && !allowedExts.includes(ext)) {
      return {
        valid: false,
        error: `Unsupported file format: ${mimeType || ext}. Supported formats: PDF, PNG, JPEG, WEBP.`,
      };
    }

    return { valid: true };
  }

  /**
   * Preprocess document for downstream OCR and entity extraction
   */
  public static async preprocess(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<PreprocessingResult> {
    const checksum = this.computeChecksum(fileBuffer);
    const warnings: string[] = [];
    const isPdf = mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');

    let pageCount = 1;
    let extractedPdfText = '';
    let preprocessedImageBuffer: Buffer | undefined;

    if (isPdf) {
      try {
        const pdfModule: any = await import('pdf-parse');
        const parser = pdfModule.default || pdfModule;
        const pdfData = await parser(fileBuffer);
        pageCount = pdfData.numpages || 1;
        extractedPdfText = pdfData.text || '';
      } catch (err: any) {
        warnings.push(`PDF text layer extraction note: ${err.message || 'No direct text stream'}`);
      }
    } else {
      // Process image with Sharp for optimal OCR readability
      try {
        preprocessedImageBuffer = await sharp(fileBuffer)
          .rotate() // Auto-orient based on EXIF
          .grayscale() // Convert to grayscale
          .normalize() // Stretch contrast
          .sharpen({ sigma: 1.0, m1: 0.5, m2: 2.0 }) // Enhance text edge clarity
          .toBuffer();
      } catch (err: any) {
        warnings.push(`Image preprocessing fallback: ${err.message}`);
        preprocessedImageBuffer = fileBuffer;
      }
    }

    return {
      checksum,
      fileSize: fileBuffer.length,
      mimeType,
      isPdf,
      pageCount,
      extractedPdfText,
      preprocessedImageBuffer,
      warnings,
    };
  }
}
