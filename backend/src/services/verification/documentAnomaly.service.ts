import { DocumentModel } from '../../models/Document.js';

export type AnomalyType = 'VISUAL' | 'METADATA' | 'STRUCTURAL';
export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'INFO';

export interface AnomalySignal {
  type: AnomalyType;
  description: string;
  severity: AnomalySeverity;
}

export interface DocumentAnomalyAnalysisResult {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  signals: AnomalySignal[];
  summary: string;
}

export class DocumentAnomalyService {
  /**
   * Perform comprehensive visual, metadata, and structural anomaly screening
   */
  public static async analyze(
    rawText: string,
    fileSize: number,
    mimeType: string,
    checksum: string,
    avgConfidence: number
  ): Promise<DocumentAnomalyAnalysisResult> {
    const signals: AnomalySignal[] = [];

    // 1. Check for Duplicate Submissions (Metadata Anomaly)
    try {
      const existingDoc = await DocumentModel.findOne({
        checksum,
      });

      if (existingDoc) {
        signals.push({
          type: 'METADATA',
          description: `Identical document checksum matches previously uploaded record #${existingDoc.documentId}. Re-submission flagged for audit.`,
          severity: 'MEDIUM',
        });
      }
    } catch (err) {
      // Ignore DB lookup error in anomaly check
    }

    // 2. OCR Confidence & Visual Resolution (Visual Anomaly)
    if (avgConfidence < 0.65) {
      signals.push({
        type: 'VISUAL',
        description: 'Low resolution or blurred scan detected. Text clarity score is below 65%.',
        severity: 'HIGH',
      });
    } else if (avgConfidence < 0.82) {
      signals.push({
        type: 'VISUAL',
        description: 'Minor blur or low contrast detected in document scan.',
        severity: 'LOW',
      });
    }

    // 3. File Size Inspection (Visual / Metadata)
    if (fileSize < 15 * 1024) {
      signals.push({
        type: 'METADATA',
        description: 'Abnormally low file size (<15 KB). May indicate truncated or heavily compressed image.',
        severity: 'MEDIUM',
      });
    }

    // 4. Structural Government Markers (Structural Anomaly)
    const textLower = rawText.toLowerCase();
    const hasGovMarker =
      textLower.includes('maharashtra') ||
      textLower.includes('महाराष्ट्र') ||
      textLower.includes('शासन') ||
      textLower.includes('revenue') ||
      textLower.includes('महसूल') ||
      textLower.includes('शासकीय') ||
      textLower.includes('अधिकार अभिलेख');

    if (!hasGovMarker && rawText.length > 50) {
      signals.push({
        type: 'STRUCTURAL',
        description: 'Official revenue header or state departmental insignia text not detected in document header.',
        severity: 'MEDIUM',
      });
    }

    // 5. Seal / Signature Context
    const hasSignatureIndicator =
      textLower.includes('तलाठी') ||
      textLower.includes('तहसीलदार') ||
      textLower.includes('स्वाक्षरी') ||
      textLower.includes('signature') ||
      textLower.includes('officer') ||
      textLower.includes('digital signature');

    if (!hasSignatureIndicator && rawText.length > 100) {
      signals.push({
        type: 'STRUCTURAL',
        description: 'Certifying officer signature/seal annotation not found in concluding section.',
        severity: 'LOW',
      });
    }

    // Determine Overall Anomaly Level
    const hasHigh = signals.some((s) => s.severity === 'HIGH');
    const mediumCount = signals.filter((s) => s.severity === 'MEDIUM').length;

    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let summary = 'No significant visual or metadata anomalies detected. Document appears authentic.';

    if (hasHigh || mediumCount >= 2) {
      level = 'HIGH';
      summary = 'Multiple visual or structural anomaly signals identified. Officer inspection required.';
    } else if (mediumCount === 1 || signals.length >= 2) {
      level = 'MEDIUM';
      summary = 'Minor advisory signals detected. Document requires officer verification.';
    }

    return {
      level,
      signals,
      summary,
    };
  }
}
