import fs from 'fs';
import path from 'path';

/**
 * OCR Service — extracts text from uploaded documents.
 *
 * Supports:
 *   - Images (JPEG, PNG, WEBP, TIFF):  Tesseract.js OCR with Marathi + Hindi + English
 *   - PDFs:                             pdf-parse text extraction (embedded text)
 *
 * Images are preprocessed with `sharp` for optimal OCR on scanned Indian land records:
 *   - Aggressive upscaling (up to 3x) for low-resolution mobile photos
 *   - Grayscale conversion + contrast normalization for aged/yellowed paper
 *   - Adaptive threshold binarization for uneven illumination
 *   - Sharpening to enhance Devanagari text strokes
 */

const IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

// ---------------------------------------------------------------------------
// Image preprocessing via sharp — optimized for Indian land record scans
// ---------------------------------------------------------------------------
async function preprocessImage(filePath: string): Promise<Buffer> {
  try {
    // Dynamically import sharp so the module doesn't crash if not installed
    const sharp = (await import('sharp')).default;
    const meta = await sharp(filePath).metadata();
    const currentWidth = meta.width || 800;
    const currentHeight = meta.height || 600;

    let pipeline = sharp(filePath);

    // Step 1: Aggressive upscaling — mobile photos of documents are often 600–1200px wide
    // Tesseract needs at least 300 DPI equivalent; ~1800–2400px wide is ideal.
    if (currentWidth < 2000) {
      const scaleFactor = Math.min(3.0, Math.max(1.8, 2000 / currentWidth));
      const newWidth = Math.round(currentWidth * scaleFactor);
      const newHeight = Math.round(currentHeight * scaleFactor);
      pipeline = pipeline.resize({
        width: newWidth,
        height: newHeight,
        fit: 'fill',
        kernel: 'lanczos3',
      });
    }

    // Step 2: Grayscale + aggressive contrast stretch for aged/yellowed paper
    const processed = await pipeline
      .grayscale()
      .normalise({ lower: 5, upper: 95 })  // wider stretch for aged documents
      .sharpen({ sigma: 2.0, m1: 1.5, m2: 3.0 })  // stronger sharpening for thin Devanagari strokes
      .threshold(145)   // binarize: converts to pure black/white, removes scan noise and paper texture
      .png({ compressionLevel: 1 })  // PNG for lossless Tesseract input (JPEG artifacts harm OCR)
      .toBuffer();
    return processed;
  } catch (err) {
    console.warn('[OCR] sharp preprocessing failed, falling back to raw buffer:', err);
    return fs.readFileSync(filePath);
  }
}

// ---------------------------------------------------------------------------
// Tesseract OCR for images
// ---------------------------------------------------------------------------
async function runTesseractOCR(imageBuffer: Buffer, language: string): Promise<string> {
  const { createWorker } = await import('tesseract.js');

  // Map document language to Tesseract language codes
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

  console.log(`[OCR] Starting Tesseract OCR — lang: ${tesseractLang}`);

  const worker = await createWorker(tesseractLang, 1, {
    // Silence verbose Tesseract logs in production
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        process.stdout.write(`\r[OCR] Progress: ${(m.progress * 100).toFixed(0)}%   `);
      }
    },
  });

  try {
    // PSM 6 = "Assume a single uniform block of text" — best for structured government forms
    // OEM 1 = LSTM neural network — most accurate for Devanagari (default in Tesseract 4+)
    await worker.setParameters({
      tessedit_pageseg_mode: '6' as any,  // PSM_SINGLE_BLOCK
      preserve_interword_spaces: '1',
    });
    const { data } = await worker.recognize(imageBuffer);
    console.log(`\n[OCR] Completed — confidence: ${data.confidence.toFixed(1)}%`);
    return data.text || '';
  } finally {
    await worker.terminate();
  }
}


// ---------------------------------------------------------------------------
// PDF text extraction
// ---------------------------------------------------------------------------
async function extractPdfText(filePath: string): Promise<string> {
  try {
    const pdfModule: any = await import('pdf-parse');
    const pdfParse = pdfModule.default || pdfModule;
    const buffer = fs.readFileSync(filePath);
    const result = await pdfParse(buffer);
    return result.text || '';
  } catch (err) {
    console.warn('[OCR] pdf-parse failed:', err);
    return '';
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface OcrResult {
  text: string;
  /** Milliseconds taken */
  durationMs: number;
  /** 'tesseract' | 'pdf-parse' | 'fallback' */
  engine: string;
}

/**
 * Extracts raw text from an uploaded document file.
 * Uses Tesseract.js for images and pdf-parse for PDFs.
 * Returns an empty string (never throws) so the caller can always fall back
 * to the heuristic extraction pipeline.
 */
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
  language: string = 'Marathi'
): Promise<OcrResult> {
  const t0 = Date.now();

  if (!fs.existsSync(filePath)) {
    return { text: '', durationMs: 0, engine: 'fallback' };
  }

  try {
    if (mimeType === 'application/pdf') {
      const text = await extractPdfText(filePath);
      return { text, durationMs: Date.now() - t0, engine: 'pdf-parse' };
    }

    if (IMAGE_MIMETYPES.includes(mimeType)) {
      const imageBuffer = await preprocessImage(filePath);
      const text = await runTesseractOCR(imageBuffer, language);
      return { text, durationMs: Date.now() - t0, engine: 'tesseract.js' };
    }

    // Unknown file type — try to read as UTF-8 text
    const raw = fs.readFileSync(filePath).toString('utf8', 0, 65536);
    return { text: raw, durationMs: Date.now() - t0, engine: 'raw-utf8' };
  } catch (err) {
    console.error('[OCR] Text extraction failed:', err);
    return { text: '', durationMs: Date.now() - t0, engine: 'fallback' };
  }
}
