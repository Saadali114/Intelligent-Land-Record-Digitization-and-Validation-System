import mongoose from 'mongoose';
import { DocumentModel, LandDocumentType } from '../../models/Document.js';
import {
  VerificationWorkflow,
  IVerificationWorkflowDocument,
} from '../../models/VerificationWorkflow.js';
import { AuditLog } from '../../models/AuditLog.js';
import { DocumentPreprocessingService } from '../document/documentPreprocessing.service.js';
import { EntityExtractionService } from '../extraction/entityExtraction.service.js';
import { DocumentTypeValidationService } from './documentTypeValidation.service.js';
import { DemoLandRecordProvider } from '../land-record/landRecord.provider.js';
import { LandRecordMatchingService } from './landRecordMatching.service.js';
import { DocumentConsistencyService } from './documentConsistency.service.js';
import { DocumentAnomalyService } from './documentAnomaly.service.js';
import { VerificationRiskService } from './verificationRisk.service.js';
import { extractTextFromBuffer } from '../ocr.service.js';

export interface ProcessDocumentInput {
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  fileUrl?: string;
  declaredDocType?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  casePreset?: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED';
}

export class VerificationOrchestrator {
  private static landRecordProvider = new DemoLandRecordProvider();

  /**
   * Complete end-to-end verification pipeline
   */
  public static async processDocument(
    input: ProcessDocumentInput
  ): Promise<IVerificationWorkflowDocument> {
    const { fileBuffer, originalName, mimeType, fileUrl, declaredDocType, user, casePreset } =
      input;

    // Step 1: Preprocessing & Checksum Validation
    const validation = DocumentPreprocessingService.validateFile(
      fileBuffer,
      originalName,
      mimeType
    );
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file format');
    }

    const preprocessed = await DocumentPreprocessingService.preprocess(
      fileBuffer,
      originalName,
      mimeType
    );

    // Step 2: OCR Text Acquisition (PDF text layer or real Tesseract OCR on images/scans)
    let extractedRawText = preprocessed.extractedPdfText || '';
    let avgConfidence = 0.95;

    // If PDF has no text layer, or if an image was uploaded, run real OCR!
    if (!extractedRawText || extractedRawText.trim().length < 20) {
      const ocrBuffer = preprocessed.preprocessedImageBuffer || fileBuffer;
      console.log(`[Verification] Running real Tesseract OCR on ${originalName} (${mimeType})...`);
      try {
        const ocrResult = await extractTextFromBuffer(ocrBuffer, mimeType, 'Marathi');
        if (ocrResult.text && ocrResult.text.trim().length > 0) {
          extractedRawText = ocrResult.text;
          avgConfidence = ocrResult.confidence;
          console.log(
            `[Verification] OCR succeeded for ${originalName} — chars: ${extractedRawText.length}, conf: ${(avgConfidence * 100).toFixed(1)}%`
          );
        }
      } catch (ocrErr) {
        console.warn(`[Verification] OCR extraction warning for ${originalName}:`, ocrErr);
      }
    }

    // Only fall back to casePreset demo text if explicitly requested by a demo caller
    // (e.g. CASE_1_GREEN, CASE_2_YELLOW, CASE_3_RED) and no real OCR text could be extracted
    if ((!extractedRawText || extractedRawText.trim().length < 15) && casePreset) {
      console.log(`[Verification] Using casePreset demo text for preset ${casePreset}`);
      extractedRawText = this.generateRepresentativeOcrText(originalName, declaredDocType);
      avgConfidence = 0.96;
    }

    // Step 3: Entity Extraction & Normalization
    const extractedEntities = EntityExtractionService.extractEntities(extractedRawText);

    // Step 4: Document Type & Structure Validation
    const typeValidation = DocumentTypeValidationService.validate(
      extractedRawText,
      declaredDocType || extractedEntities.documentType
    );

    // Step 5: Official Cadastral Match Query (Demo Land Record Provider)
    const officialRecord = await this.landRecordProvider.findMatchingRecord({
      surveyNumber: extractedEntities.surveyNumber.value,
      gatNumber: extractedEntities.gatNumber?.value,
      ownerName: extractedEntities.ownerName.value,
      village: extractedEntities.village.value,
      tehsil: extractedEntities.taluka.value,
      district: extractedEntities.district.value,
    });

    // Step 6: Field-by-Field Cadastral Matching & Relationship Verification
    const matchResult = LandRecordMatchingService.match(
      extractedEntities,
      officialRecord,
      user.name
    );

    // Step 7: Multi-point Internal Document Consistency Check
    const consistency = DocumentConsistencyService.check(extractedEntities, extractedRawText);

    // Step 8: Visual, Metadata, and Structural Anomaly Analysis
    const anomaly = await DocumentAnomalyService.analyze(
      extractedRawText,
      preprocessed.fileSize,
      mimeType,
      preprocessed.checksum,
      extractedEntities.avgConfidence
    );

    // Step 9: Rule-based Transparent Risk Evaluation
    const riskAssessment = VerificationRiskService.calculate(
      true, // user registered and email/OTP authenticated
      typeValidation,
      matchResult,
      consistency,
      anomaly
    );

    // Step 10: Generate Unique Application and Document IDs
    const now = new Date();
    const timestampStr = now.getTime().toString().slice(-6);
    const applicationId = `APP-${now.getFullYear()}-${timestampStr}`;
    const documentId = `DOC-MH-${now.getFullYear()}-${timestampStr}`;

    // Step 11: Save Document Entity to Database
    const docModelType = (typeValidation.detectedType as LandDocumentType) || '7_12';
    const docRecord = await DocumentModel.create({
      documentId,
      fileName: originalName,
      originalName,
      filePath: fileUrl || `/uploads/${originalName}`,
      fileType: mimeType.split('/')[1]?.toUpperCase() || 'PDF',
      fileSize: preprocessed.fileSize,
      mimeType,
      language: 'Marathi',
      uploadedBy: new mongoose.Types.ObjectId(user._id),
      processingStatus: 'PENDING_OFFICER_REVIEW',
      documentTypeEnum: docModelType,
      checksum: preprocessed.checksum,
      version: 1,
      pageCount: preprocessed.pageCount,
      uploadedAt: now,
      metadata: {
        scannedDPI: 300,
        riskScore: riskAssessment.score,
        riskLevel: riskAssessment.level,
        extractedConfidence: extractedEntities.avgConfidence,
      },
    });

    // Step 12: Construct Workflow Document
    const workflow = await VerificationWorkflow.create({
      applicationId,
      userId: new mongoose.Types.ObjectId(user._id),
      documentId: docRecord._id,
      status: 'PENDING_OFFICER_REVIEW',
      casePreset,
      applicant: {
        name: user.name,
        mobile: user.phone || '+91 98220 14521',
        email: user.email,
        identityStatus: 'VERIFIED',
        identityMethod: 'EMAIL_OTP_AUTHENTICATED',
        verifiedAt: now,
        demoNote: 'Prototype Verification Environment (Registered Citizen Account)',
      },
      document: {
        documentType: typeValidation.detectedType,
        fileName: originalName,
        fileSize: `${(preprocessed.fileSize / (1024 * 1024)).toFixed(2)} MB`,
        fileUrl: fileUrl || '/sample-712-extract.png',
        uploadedAt: now,
        ocrEngine: 'Cadastral Tesseract OCR v5.3 + Vision AI',
        avgConfidence: extractedEntities.avgConfidence,
        extractedFields: extractedEntities.allFields,
        consistency: {
          status: consistency.status,
          summary: consistency.summary,
          checks: consistency.checks,
          visualAnomaliesDetected: consistency.visualAnomaliesDetected,
          anomalyNotes: consistency.anomalyNotes,
        },
      },
      ocrData: {
        language: 'mar',
        rawText: extractedRawText,
        confidence: extractedEntities.avgConfidence,
        pages: [
          {
            pageNumber: 1,
            text: extractedRawText,
            confidence: extractedEntities.avgConfidence,
          },
        ],
      },
      anomalyAnalysis: {
        level: anomaly.level,
        signals: anomaly.signals,
      },
      officialRecordMatch: {
        status: matchResult.status,
        matchedRecordId: matchResult.matchedRecordId,
        matchedVillage: matchResult.matchedVillage,
        matchedTaluka: matchResult.matchedTaluka,
        matchedDistrict: matchResult.matchedDistrict,
        matchedSurveyNumber: matchResult.matchedSurveyNumber,
        fieldComparisons: matchResult.fieldComparisons,
        summary: matchResult.summary,
      },
      relationshipVerification: matchResult.relationship,
      riskAssessment,
      officerDecision: {
        status: 'PENDING',
      },
      auditTimeline: [
        {
          timestamp: now.toISOString(),
          action: 'DOCUMENT_UPLOADED',
          actor: user.name,
          actorRole: 'CITIZEN',
          description: `Document "${originalName}" uploaded for AI-assisted verification. Checksum: ${preprocessed.checksum.substring(
            0,
            12
          )}...`,
        },
        {
          timestamp: new Date(now.getTime() + 1000).toISOString(),
          action: 'AI_PIPELINE_EXECUTED',
          actor: 'ILRDVS AI Engine',
          actorRole: 'SYSTEM',
          description: `OCR processed with ${Math.round(
            extractedEntities.avgConfidence * 100
          )}% confidence. Risk score calculated: ${riskAssessment.score}/100 (${
            riskAssessment.level
          }).`,
        },
        {
          timestamp: new Date(now.getTime() + 2000).toISOString(),
          action: 'CADASTRAL_CROSSCHECK_COMPLETED',
          actor: 'DemoLandRecordProvider',
          actorRole: 'SYSTEM',
          description: `Cadastral cross-check status: ${matchResult.status}. Matched Record: ${matchResult.matchedRecordId}.`,
        },
      ],
    });

    // Step 13: System Audit Trail
    await AuditLog.create({
      userId: user._id,
      action: 'DOCUMENT_VERIFICATION_INITIATED',
      resourceType: 'VerificationWorkflow',
      resourceId: workflow.applicationId,
      description: `Verification workflow ${workflow.applicationId} initiated for document ${documentId}`,
      timestamp: now,
    });

    return workflow;
  }

  /**
   * Fallback text generator providing realistic Marathi / Indian cadastral OCR output
   */
  private static generateRepresentativeOcrText(
    fileName: string,
    declaredDocType?: string
  ): string {
    const fn = (fileName || '').toLowerCase();
    const dt = (declaredDocType || '').toLowerCase();

    if (fn.includes('kulkarni') || fn.includes('88') || dt.includes('8a')) {
      return `
महाराष्ट्र शासन महसूल विभाग
गाव नमुना सात (अधिकार अभिलेख पत्रक)
गाव: वाणी | तालुका: दिंडोरी | जिल्हा: नाशिक
भूमापन क्रमांक / गट क्रमांक: ८८/३ (88/3)
भोगवटादाराचे नाव: श्रीमती मीना राजेंद्र कुलकर्णी (Meena Rajendra Kulkarni)
खाते क्रमांक: ११२
क्षेत्र: ० हेक्टर ८५ आर (0.85 Hectares)
आकारणी: रु. ४.२५
फेरफार क्रमांक: ४१०९
पिकांची नोंद: बागायत / द्राक्ष बाग
      `.trim();
    }

    if (fn.includes('rahul') || fn.includes('211')) {
      return `
महाराष्ट्र शासन महसूल विभाग
गाव नमुना सात (अधिकार अभिलेख पत्रक)
गाव: वाघोली | तालुका: हवेली | जिल्हा: पुणे
भूमापन क्रमांक / गट क्रमांक: २११/४ (211/4)
भोगवटादाराचे नाव: श्री राहुल शंकर पाटील (Rahul Shankar Patil)
खाते क्रमांक: ५८९
क्षेत्र: २ हेक्टर १० आर (2.10 Hectares)
आकारणी: रु. ९.५०
फेरफार क्रमांक: ९९२१
पिकांची नोंद: बिगर शेती (निवासी)
      `.trim();
    }

    // Default canonical extract for Shankar Ganpat Patil (145/2A)
    return `
महाराष्ट्र शासन महसूल व वन विभाग
गाव नमुना सात (अधिकार अभिलेख पत्रक)
गाव: खडकवासला | तालुका: हवेली | जिल्हा: पुणे
भूमापन क्रमांक / गट क्रमांक: १४५/२अ (145/2A)
भोगवटादाराचे नाव: श्री शंकर गणपत पाटील (Shankar Ganpat Patil)
खाते क्रमांक: ३०४
क्षेत्र: १ हेक्टर २५ आर (1.25 Hectares)
आकारणी: रु. ६.५०
फेरफार क्रमांक: ८८१२
पिकांची नोंद: जिरायत
    `.trim();
  }
}
