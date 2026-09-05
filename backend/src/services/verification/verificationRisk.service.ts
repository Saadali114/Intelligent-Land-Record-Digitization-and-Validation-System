import { RiskLevel } from '../../models/VerificationWorkflow.js';
import { MatchingResult } from './landRecordMatching.service.js';
import { ConsistencyCheckResult } from './documentConsistency.service.js';
import { DocumentAnomalyAnalysisResult } from './documentAnomaly.service.js';
import { DocumentTypeValidationResult } from './documentTypeValidation.service.js';

export interface VerificationRiskResult {
  level: RiskLevel;
  score: number; // 0 (safest) to 100 (highest risk)
  signals: {
    positive: string[];
    negative: string[];
  };
  reasons: string[];
  summary: string;
}

export class VerificationRiskService {
  /**
   * Calculate a transparent, rule-based risk score with positive and negative signals
   */
  public static calculate(
    identityVerified: boolean,
    docValidation: DocumentTypeValidationResult,
    matchResult: MatchingResult,
    consistency: ConsistencyCheckResult,
    anomaly: DocumentAnomalyAnalysisResult
  ): VerificationRiskResult {
    let score = 10; // Baseline base score
    const positive: string[] = [];
    const negative: string[] = [];
    const reasons: string[] = [];

    // 1. Identity Pillar (+0 to +35)
    if (identityVerified) {
      positive.push('Applicant identity verified via OTP authenticated credentials');
    } else {
      score += 20;
      negative.push('Applicant identity unverified or pending OTP confirmation');
      reasons.push('Identity verification incomplete');
    }

    if (matchResult.relationship.status === 'MATCHED') {
      positive.push('Applicant is primary registered Khatedar/Owner in government registry');
    } else if (matchResult.relationship.status === 'EVIDENCE_REQUIRED') {
      score += 25;
      negative.push(
        `Applicant name does not directly match cadastral owner (${matchResult.relationship.explanation})`
      );
      reasons.push('Owner name mismatch with applicant credentials');
    } else {
      score += 35;
      negative.push('Applicant has no established cadastral connection with the land parcel');
      reasons.push('Cadastral title relationship unestablished');
    }

    // 2. Document & Structure Pillar (+0 to +25)
    if (docValidation.status === 'PASS') {
      positive.push(`Document structure authenticated as standard ${docValidation.detectedType} form`);
    } else {
      score += 25;
      negative.push(docValidation.notes);
      reasons.push('Document layout deviates from standard state revenue forms');
    }

    // 3. Cadastral Cross-Check Pillar (+0 to +35)
    if (matchResult.status === 'STRONG_MATCH') {
      positive.push('Cadastral attributes (Survey, Village, Taluka, Area) match official reference record');
    } else if (matchResult.status === 'PARTIAL_MATCH') {
      score += 20;
      negative.push(matchResult.summary);
      reasons.push('Partial match against government reference record');
    } else if (matchResult.status === 'MISMATCH') {
      score += 35;
      negative.push(matchResult.summary);
      reasons.push('Critical discrepancy with official cadastral record');
    } else {
      score += 30;
      negative.push('No corresponding cadastral reference record found in system repository');
      reasons.push('Cadastral reference record not located');
    }

    // 4. Document Consistency (+0 to +20)
    if (consistency.status === 'PASSED') {
      positive.push('All 6 structural and internal consistency validation checks passed');
    } else if (consistency.status === 'WARNING') {
      score += 15;
      negative.push(consistency.summary);
      reasons.push('Internal document consistency advisory flagged');
    } else {
      score += 25;
      negative.push(consistency.summary);
      reasons.push('Failed internal document consistency validation');
    }

    // 5. Visual and Metadata Anomalies (+0 to +25)
    if (anomaly.level === 'LOW') {
      positive.push('Visual resolution and document metadata verified with zero tampering signals');
    } else if (anomaly.level === 'MEDIUM') {
      score += 15;
      anomaly.signals.forEach((s) => negative.push(s.description));
      reasons.push('Visual or metadata discrepancy signals detected');
    } else {
      score += 30;
      anomaly.signals.forEach((s) => negative.push(s.description));
      reasons.push('High visual anomaly detected (blur, compression, or format discrepancy)');
    }

    // Clamp score to 0 - 100
    const clampedScore = Math.min(100, Math.max(5, score));

    // Determine Risk Level
    let level: RiskLevel = 'LOW';
    let summary = 'Document evaluation shows low discrepancy risk. Recommended for officer approval.';

    if (clampedScore >= 70) {
      level = 'HIGH';
      summary = 'Document evaluation indicates elevated risk. Officer inspection and verification required.';
    } else if (clampedScore >= 30) {
      level = 'MEDIUM';
      summary = 'Advisory signals detected. Officer clarification or document re-inspection suggested.';
    }

    return {
      level,
      score: clampedScore,
      signals: {
        positive,
        negative,
      },
      reasons,
      summary,
    };
  }
}
