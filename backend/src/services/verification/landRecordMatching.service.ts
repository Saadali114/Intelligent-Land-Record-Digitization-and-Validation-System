import { CadastralRecordResult } from '../land-record/landRecord.provider.js';
import { ExtractedDocumentEntities } from '../extraction/entityExtraction.service.js';
import { NormalizationService } from '../extraction/normalization.service.js';
import {
  MatchStatus,
  IOfficialRecordMatchField,
  RelationshipType,
  RelationshipStatus,
} from '../../models/VerificationWorkflow.js';

export interface MatchingResult {
  status: MatchStatus;
  matchedRecordId: string;
  matchedVillage: string;
  matchedTaluka: string;
  matchedDistrict: string;
  matchedSurveyNumber: string;
  fieldComparisons: IOfficialRecordMatchField[];
  summary: string;
  relationship: {
    status: RelationshipStatus;
    relationshipType: RelationshipType;
    landOwnerName: string;
    applicantName: string;
    evidenceRequired: boolean;
    explanation: string;
  };
}

export class LandRecordMatchingService {
  /**
   * Perform field-by-field consistency matching between extracted document entities and government reference record
   */
  public static match(
    extracted: ExtractedDocumentEntities,
    officialRecord: CadastralRecordResult | null,
    applicantName: string
  ): MatchingResult {
    if (!officialRecord) {
      return {
        status: 'NOT_FOUND',
        matchedRecordId: '',
        matchedVillage: '',
        matchedTaluka: '',
        matchedDistrict: '',
        matchedSurveyNumber: '',
        fieldComparisons: [],
        summary: 'No corresponding cadastral reference record found in system repository.',
        relationship: {
          status: 'NOT_ESTABLISHED',
          relationshipType: 'NOT_ESTABLISHED',
          landOwnerName: extracted.ownerName.value,
          applicantName,
          evidenceRequired: true,
          explanation: 'Official cadastral record could not be located to verify applicant title.',
        },
      };
    }

    const fieldComparisons: IOfficialRecordMatchField[] = [];

    // 1. Owner Name Comparison
    const normDocOwner = NormalizationService.normalizeName(extracted.ownerName.value);
    const normOffOwner = NormalizationService.normalizeName(officialRecord.ownerName);
    const isOwnerMatch =
      normDocOwner === normOffOwner ||
      normDocOwner.includes(normOffOwner) ||
      normOffOwner.includes(normDocOwner) ||
      this.tokenOverlap(normDocOwner, normOffOwner) >= 0.6;

    fieldComparisons.push({
      fieldName: 'Owner Name (खातेदार)',
      uploadedValue: extracted.ownerName.value,
      officialValue: officialRecord.ownerName,
      isMatch: isOwnerMatch,
    });

    // 2. Survey / Gat Number Comparison
    const normDocSurvey = NormalizationService.normalizeSurveyNumber(extracted.surveyNumber.value);
    const normOffSurvey = NormalizationService.normalizeSurveyNumber(officialRecord.surveyNumber);
    const isSurveyMatch = normDocSurvey === normOffSurvey;

    fieldComparisons.push({
      fieldName: 'Survey / Gat No. (गट क्र.)',
      uploadedValue: extracted.surveyNumber.value,
      officialValue: officialRecord.surveyNumber,
      isMatch: isSurveyMatch,
    });

    // 3. Village Comparison
    const normDocVillage = NormalizationService.normalizeName(extracted.village.value);
    const normOffVillage = NormalizationService.normalizeName(officialRecord.village);
    const isVillageMatch =
      normDocVillage.includes(normOffVillage) || normOffVillage.includes(normDocVillage);

    fieldComparisons.push({
      fieldName: 'Village (गाव)',
      uploadedValue: extracted.village.value,
      officialValue: officialRecord.village,
      isMatch: isVillageMatch,
    });

    // 4. Taluka Comparison
    const normDocTaluka = NormalizationService.normalizeName(extracted.taluka.value);
    const normOffTaluka = NormalizationService.normalizeName(officialRecord.tehsil);
    const isTalukaMatch =
      normDocTaluka.includes(normOffTaluka) || normOffTaluka.includes(normDocTaluka);

    fieldComparisons.push({
      fieldName: 'Taluka (तालुका)',
      uploadedValue: extracted.taluka.value,
      officialValue: officialRecord.tehsil,
      isMatch: isTalukaMatch,
    });

    // 5. Area Comparison
    const docAreaNorm = NormalizationService.normalizeArea(extracted.plotArea.value);
    const offAreaNorm = NormalizationService.normalizeArea(officialRecord.plotArea);
    const areaDiff = Math.abs(docAreaNorm.areaInHectares - offAreaNorm.areaInHectares);
    const isAreaMatch = areaDiff < 0.05; // 0.05 Ha tolerance

    fieldComparisons.push({
      fieldName: 'Plot Area (क्षेत्र)',
      uploadedValue: extracted.plotArea.value,
      officialValue: officialRecord.plotArea,
      isMatch: isAreaMatch,
    });

    // Determine Overall Cadastral Match Status
    const totalFields = fieldComparisons.length;
    const matchedCount = fieldComparisons.filter((f) => f.isMatch).length;

    let status: MatchStatus = 'STRONG_MATCH';
    let summary = 'Document data fully aligns with official reference cadastral register.';

    if (matchedCount === totalFields) {
      status = 'STRONG_MATCH';
    } else if (matchedCount >= 3 && isSurveyMatch) {
      status = 'PARTIAL_MATCH';
      summary = `Cadastral cross-check indicates partial concordance (${matchedCount}/${totalFields} fields match).`;
    } else {
      status = 'MISMATCH';
      summary = `Critical discrepancies detected against government reference record (${matchedCount}/${totalFields} fields match).`;
    }

    // Determine Applicant to Land Title Relationship
    const normApplicant = NormalizationService.normalizeName(applicantName);
    const isApplicantOwner =
      normApplicant === normOffOwner ||
      normApplicant.includes(normOffOwner) ||
      normOffOwner.includes(normApplicant) ||
      this.tokenOverlap(normApplicant, normOffOwner) >= 0.6;

    let relStatus: RelationshipStatus = 'MATCHED';
    let relType: RelationshipType = 'OWNER';
    let evidenceRequired = false;
    let explanation = 'Applicant identity matches primary Khatedar name recorded in cadastral registry.';

    if (!isApplicantOwner) {
      // Check if same surname / potential legal heir
      const applicantSurname = normApplicant.split(' ').pop() || '';
      const ownerSurname = normOffOwner.split(' ').pop() || '';

      if (applicantSurname && applicantSurname === ownerSurname) {
        relStatus = 'EVIDENCE_REQUIRED';
        relType = 'LEGAL_HEIR';
        evidenceRequired = true;
        explanation =
          'Applicant shares surname with registered Khatedar. Succession or heirship certificate required for verification.';
      } else {
        relStatus = 'EVIDENCE_REQUIRED';
        relType = 'OTHER';
        evidenceRequired = true;
        explanation = `Applicant name "${applicantName}" does not match registered title owner "${officialRecord.ownerName}". Authority letter or sale proof required.`;
      }
    }

    return {
      status,
      matchedRecordId: officialRecord.recordId,
      matchedVillage: officialRecord.village,
      matchedTaluka: officialRecord.tehsil,
      matchedDistrict: officialRecord.district,
      matchedSurveyNumber: officialRecord.surveyNumber,
      fieldComparisons,
      summary,
      relationship: {
        status: relStatus,
        relationshipType: relType,
        landOwnerName: officialRecord.ownerName,
        applicantName,
        evidenceRequired,
        explanation,
      },
    };
  }

  private static tokenOverlap(s1: string, s2: string): number {
    const tokens1 = new Set(s1.split(/\s+/).filter(Boolean));
    const tokens2 = new Set(s2.split(/\s+/).filter(Boolean));
    if (tokens1.size === 0 || tokens2.size === 0) return 0;

    let overlap = 0;
    for (const t of tokens1) {
      if (tokens2.has(t)) overlap++;
    }

    return overlap / Math.max(tokens1.size, tokens2.size);
  }
}
