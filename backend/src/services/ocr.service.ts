import fs from 'fs';
import path from 'path';

/**
 * OCR Service — extracts text from uploaded documents.
 *
 * Supports:
 *   - Images (JPEG, PNG, WEBP, TIFF): Tesseract.js OCR with Marathi + Hindi + English
 *   - PDFs: pdf-parse text extraction (embedded text)
 *
 * Preprocessing with `sharp`:
 *   - Non-destructive contrast stretch (normalise)
 *   - Gentle stroke sharpening for Devanagari script
 *   - Preserves grayscale depth and anti-aliasing (NO destructive hard thresholding)
 *   - Aspect-ratio preserving high-resolution upscaling (minimum 2000px width)
 */

const IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

/**
 * Preprocess image buffer with Sharp for optimal OCR readability
 */
export async function preprocessImageBuffer(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(inputBuffer).metadata();
    const currentWidth = meta.width || 800;
    const currentHeight = meta.height || 600;

    let pipeline = sharp(inputBuffer).rotate(); // auto-orient based on EXIF

    // Step 1: High-resolution upscaling while strictly preserving aspect ratio
    // Tesseract achieves optimal Devanagari character recognition at 2000-2400px width
    if (currentWidth < 1800) {
      const scale = Math.min(3.0, 2200 / currentWidth);
      const targetWidth = Math.round(currentWidth * scale);
      pipeline = pipeline.resize({
        width: targetWidth,
        fit: 'inside',
        withoutEnlargement: false,
        kernel: 'lanczos3',
      });
    }

    // Step 2: Grayscale + dynamic contrast stretching + gentle sharpening
    // Note: We deliberately avoid hard binary thresholding (.threshold(145))
    // because hard thresholding obliterates light strokes, matras, and anti-aliased font edges.
    const processed = await pipeline
      .grayscale()
      .normalise({ lower: 2, upper: 98 })
      .gamma(1.05)
      .sharpen({ sigma: 1.0, m1: 0.5, m2: 2.0 })
      .png({ compressionLevel: 1 })
      .toBuffer();

    return processed;
  } catch (err) {
    console.warn('[OCR] Sharp preprocessing error, using raw buffer:', err);
    return inputBuffer;
  }
}

/**
 * Run Tesseract.js OCR on preprocessed image buffer
 */
export async function runTesseractOCR(
  imageBuffer: Buffer,
  language: string = 'Marathi'
): Promise<{ text: string; confidence: number }> {
  const { createWorker } = await import('tesseract.js');

  const langMap: Record<string, string> = {
    Marathi: 'mar+hin+eng',
    Hindi: 'hin+eng',
    English: 'eng',
    Gujarati: 'guj+eng',
    Bengali: 'ben+eng',
    Tamil: 'tam+eng',
    Telugu: 'tel+eng',
    Kannada: 'kan+eng',
    Malayalam: 'mal+eng',
    Punjabi: 'pan+eng',
    Odia: 'ori+eng',
  };

  const tesseractLang = langMap[language] || 'mar+hin+eng';

  console.log(`[OCR] Initializing Tesseract with language(s): ${tesseractLang}`);

  let worker: any = null;
  try {
    try {
      worker = await createWorker(tesseractLang, 1);
    } catch (langErr) {
      console.warn(`[OCR] Failed to load ${tesseractLang}, falling back to eng+hin:`, langErr);
      worker = await createWorker('hin+eng', 1);
    }

    // PSM 3 = Fully automatic page segmentation (properly parses complex tables,
    // columns, and multi-line headers in 7/12 land records)
    await worker.setParameters({
      tessedit_pageseg_mode: '3' as any,
      preserve_interword_spaces: '1',
    });

    const { data } = await worker.recognize(imageBuffer);
    const confidence = (data.confidence || 80) / 100;
    console.log(`[OCR] Recognition completed — Confidence: ${(confidence * 100).toFixed(1)}%, Length: ${data.text.length} chars`);
    return {
      text: data.text || '',
      confidence,
    };
  } catch (err) {
    console.error('[OCR] Tesseract recognition failed:', err);
    return { text: '', confidence: 0 };
  } finally {
    if (worker) {
      await worker.terminate().catch(() => {});
    }
  }
}

/**
 * PDF text extraction using pdf-parse
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfModule: any = await import('pdf-parse');
    const pdfParse = pdfModule.default || pdfModule;
    const result = await pdfParse(buffer);
    return result.text || '';
  } catch (err) {
    console.warn('[OCR] pdf-parse failed:', err);
    return '';
  }
}

export interface OcrResult {
  text: string;
  confidence: number;
  durationMs: number;
  engine: string;
}

/**
 * Extract text directly from Buffer (memory storage uploads)
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  language: string = 'Marathi'
): Promise<OcrResult> {
  const t0 = Date.now();

  try {
    if (mimeType === 'application/pdf') {
      const text = await extractPdfText(buffer);
      return {
        text,
        confidence: 0.95,
        durationMs: Date.now() - t0,
        engine: 'pdf-parse',
      };
    }

    if (IMAGE_MIMETYPES.includes(mimeType) || mimeType.startsWith('image/')) {
      const preprocessed = await preprocessImageBuffer(buffer);
      const { text, confidence } = await runTesseractOCR(preprocessed, language);
      return {
        text,
        confidence,
        durationMs: Date.now() - t0,
        engine: 'tesseract.js-sharp',
      };
    }

    // Default raw text
    const text = buffer.toString('utf8');
    return {
      text,
      confidence: 0.8,
      durationMs: Date.now() - t0,
      engine: 'raw-utf8',
    };
  } catch (err) {
    console.error('[OCR] Extraction failed:', err);
    return { text: '', confidence: 0, durationMs: Date.now() - t0, engine: 'fallback' };
  }
}

/**
 * Extract text from file on disk
 */
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
  language: string = 'Marathi'
): Promise<OcrResult> {
  if (!fs.existsSync(filePath)) {
    return { text: '', confidence: 0, durationMs: 0, engine: 'fallback' };
  }

  const buffer = fs.readFileSync(filePath);
  return extractTextFromBuffer(buffer, mimeType, language);
}
