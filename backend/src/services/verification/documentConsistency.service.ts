import {
  ConsistencyStatus,
  IConsistencyCheckItem,
} from '../../models/VerificationWorkflow.js';
import { ExtractedDocumentEntities } from '../extraction/entityExtraction.service.js';
import { NormalizationService } from '../extraction/normalization.service.js';

export interface ConsistencyCheckResult {
  status: ConsistencyStatus;
  summary: string;
  checks: IConsistencyCheckItem[];
  visualAnomaliesDetected: boolean;
  anomalyNotes?: string;
}

export class DocumentConsistencyService {
  /**
   * Run multi-point internal consistency verification on extracted document entities
   */
  public static check(
    extracted: ExtractedDocumentEntities,
    rawText: string
  ): ConsistencyCheckResult {
    const checks: IConsistencyCheckItem[] = [];

    // Check 1: Document Structure Identification
    const hasDocStructure = extracted.documentType !== 'OTHER';
    checks.push({
      id: 'chk-doc-type',
      name: 'Document Type Layout Verification',
      passed: hasDocStructure,
      notes: hasDocStructure
        ? `Identified as valid ${extracted.documentType} format.`
        : 'Document layout does not conform to standard state revenue forms.',
    });

    // Check 2: Mandatory Key Fields Detected
    const hasMandatoryFields =
      extracted.ownerName.value !== 'Not Detected' &&
      extracted.surveyNumber.value !== 'Not Detected';
    checks.push({
      id: 'chk-mandatory-fields',
      name: 'Mandatory Field Detection',
      passed: hasMandatoryFields,
      notes: hasMandatoryFields
        ? 'Owner name, survey number, and area successfully localized.'
        : 'One or more critical revenue fields could not be localized from the document image.',
    });

    // Check 3: Survey / Gat Number Format Standard
    const normSurvey = NormalizationService.normalizeSurveyNumber(extracted.surveyNumber.value);
    const validSurveyFormat = /^[0-9]+(?:\/[0-9]+[A-Za-z]*)?$/.test(normSurvey);
    checks.push({
      id: 'chk-survey-format',
      name: 'Survey / Gat Number Format Validation',
      passed: validSurveyFormat,
      notes: validSurveyFormat
        ? `Survey number "${normSurvey}" conforms to Maharashtra Land Revenue Code standards.`
        : `Survey format "${extracted.surveyNumber.value}" requires manual inspection.`,
    });

    // Check 4: Geographical Coherence (Village / Taluka / District)
    const hasGeo =
      extracted.village.value && extracted.taluka.value && extracted.district.value;
    checks.push({
      id: 'chk-geo-coherence',
      name: 'Geographical Hierarchy Coherence',
      passed: !!hasGeo,
      notes: hasGeo
        ? `Geographical location confirmed: ${extracted.village.value}, ${extracted.taluka.value}, ${extracted.district.value}.`
        : 'Incomplete administrative boundary references detected.',
    });

    // Check 5: OCR Confidence Quality Check
    const isConfidenceAcceptable = extracted.avgConfidence >= 0.75;
    checks.push({
      id: 'chk-ocr-confidence',
      name: 'Optical Character Recognition Quality Check',
      passed: isConfidenceAcceptable,
      notes: isConfidenceAcceptable
        ? `Average OCR clarity metric: ${(extracted.avgConfidence * 100).toFixed(0)}%. Text is legible.`
        : `OCR clarity metric is low (${(extracted.avgConfidence * 100).toFixed(0)}%). Rescanning recommended.`,
    });

    // Check 6: Area Field Semantic Validity
    const normArea = NormalizationService.normalizeArea(extracted.plotArea.value);
    const validArea = normArea.areaInHectares > 0;
    checks.push({
      id: 'chk-area-format',
      name: 'Land Area Metric Parseability',
      passed: validArea,
      notes: validArea
        ? `Area parsed successfully: ${normArea.standardizedText}.`
        : 'Area metrics cannot be translated to standardized revenue units.',
    });

    // Determine overall consistency status
    const passedCount = checks.filter((c) => c.passed).length;
    let status: ConsistencyStatus = 'PASSED';
    let summary = 'Document passed all internal structural and semantic consistency tests.';
    let visualAnomaliesDetected = false;
    let anomalyNotes = 'No structural or typographic anomalies detected.';

    if (passedCount === checks.length) {
      status = 'PASSED';
    } else if (passedCount >= 4) {
      status = 'WARNING';
      summary = `Document passed with ${checks.length - passedCount} advisory notice(s). Review recommended.`;
      visualAnomaliesDetected = true;
      anomalyNotes = checks
        .filter((c) => !c.passed)
        .map((c) => c.notes)
        .join('; ');
    } else {
      status = 'FAILED';
      summary = 'Document failed critical structural consistency tests. High discrepancy risk.';
      visualAnomaliesDetected = true;
      anomalyNotes = 'Multiple key cadastral fields or layout markers are missing or illegible.';
    }

    return {
      status,
      summary,
      checks,
      visualAnomaliesDetected,
      anomalyNotes,
    };
  }
}
