import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { DocumentModel, IDocument, DocumentProcessingStatus } from '../models/Document.js';
import { LandRecord } from '../models/LandRecord.js';
import { prisma, withMongoId } from '../config/prisma.js';
import { DocumentQueryInput } from '../schemas/document.schema.js';
import { PaginationMeta } from '../utils/response.js';
import { logAudit } from '../utils/audit.js';
import { extractLandRecordFromDocument } from './ai-extraction.service.js';

export const generateDocumentId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DOC-${timestamp}-${randomStr}`;
};

export const createDocumentRecord = async (
  file: Express.Multer.File,
  metadata: { language?: string; fileType?: string },
  userId: string,
  ip?: string
) => {
  const documentId = generateDocumentId();
  let checksum: string | undefined;

  try {
    const fileBuffer = fs.readFileSync(file.path);
    checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  } catch {
    // Ignore checksum calculation failure
  }

  // Check if this document was previously uploaded (by hash or filename+size)
  let isReuploaded = false;
  let reuploadedFromId: string | undefined = undefined;

  const existingDoc = await DocumentModel.findOne({
    $or: [
      checksum ? { checksum } : null,
      { originalName: file.originalname, fileSize: file.size },
    ].filter(Boolean) as any,
  }).sort({ createdAt: 1 });

  if (existingDoc) {
    isReuploaded = true;
    reuploadedFromId = existingDoc.documentId;
  }

  const doc = await DocumentModel.create({
    documentId,
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    fileType: metadata.fileType || path.extname(file.originalname).replace('.', '').toUpperCase(),
    fileSize: file.size,
    mimeType: file.mimetype,
    language: metadata.language || 'Marathi',
    uploadedBy: userId,
    processingStatus: 'UPLOADED',
    checksum,
    isReuploaded,
    reuploadedFromId,
    uploadedAt: new Date(),
    metadata: {
      originalSize: file.size,
      mimeType: file.mimetype,
      encoding: file.encoding,
      uploadSource: 'Web Portal',
      isReuploaded,
      reuploadedFromId,
      aiPipeline: {
        ocrReady: true,
        engine: 'ILRDVS-Cadastral-AI-Engine-v2.4',
      },
    },
  });

  await logAudit({
    userId: userId as any,
    action: 'DOCUMENT_UPLOADED',
    resourceType: 'Document',
    resourceId: doc._id.toString(),
    description: `Uploaded document ${file.originalname} (${doc.documentId})`,
    ipAddress: ip,
  });

  // Automatically trigger AI Cadastral Extraction pipeline
  try {
    await extractLandRecordFromDocument(doc._id.toString(), userId, ip);
  } catch (extractErr) {
    console.warn('Auto AI extraction triggered warning:', extractErr);
  }

  const updatedDoc = await DocumentModel.findById(doc._id)
    .populate('uploadedBy', 'name email role department district')
    .lean();

  const linkedRecord = await LandRecord.findOne({ sourceDocument: doc._id }).lean();

  return {
    ...(updatedDoc || doc.toObject()),
    fileUrl: `/uploads/${file.filename}`,
    landRecord: linkedRecord || null,
  };
};

export const extractDocumentService = async (documentId: string, userId: string, ip?: string) => {
  return extractLandRecordFromDocument(documentId, userId, ip);
};

export const getDocumentsService = async (query: DocumentQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.status) {
    filter.processingStatus = query.status;
  }
  if (query.language) {
    filter.language = { $regex: query.language, $options: 'i' };
  }
  if (query.search) {
    filter.$or = [
      { originalName: { $regex: query.search, $options: 'i' } },
      { fileName: { $regex: query.search, $options: 'i' } },
      { documentId: { $regex: query.search, $options: 'i' } },
      { language: { $regex: query.search, $options: 'i' } },
      { fileType: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortField = query.sortBy || 'uploadedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

  const [total, documents] = await Promise.all([
    DocumentModel.countDocuments(filter),
    DocumentModel.find(filter)
      .populate('uploadedBy', 'name email role department district')
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  // Batch query linked land records
  const docIds = documents.map((d) => d.id || d._id).filter(Boolean);
  const landRecords = docIds.length > 0
    ? await prisma.landRecord.findMany({
        where: { sourceDocumentId: { in: docIds } },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          verifiedBy: { select: { id: true, name: true, email: true } },
        },
      })
    : [];

  const lrMap = new Map(landRecords.map((lr) => [lr.sourceDocumentId, withMongoId(lr)]));

  const enrichedDocs = documents.map((d) => {
    const docId = d.id || d._id;
    return {
      ...d,
      fileUrl: `/uploads/${d.fileName}`,
      landRecord: lrMap.get(docId) || null,
    };
  });

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };

  return { documents: enrichedDocs, pagination };
};

export const getDocumentByIdService = async (id: string) => {
  const doc = await DocumentModel.findById(id)
    .populate('uploadedBy', 'name email role department district')
    .lean();
  if (!doc) {
    throw new Error('Document not found');
  }

  const landRecord = await LandRecord.findOne({ sourceDocument: doc._id }).lean();

  return {
    ...doc,
    fileUrl: `/uploads/${doc.fileName}`,
    landRecord: landRecord || null,
  };
};

export const deleteDocumentService = async (id: string, userId: string, ip?: string) => {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new Error('Document not found');
  }

  // Delete physical file if exists
  if (fs.existsSync(doc.filePath)) {
    try {
      fs.unlinkSync(doc.filePath);
    } catch (e) {
      console.warn('Could not remove file on disk:', e);
    }
  }

  await DocumentModel.findByIdAndDelete(id);

  await logAudit({
    userId: userId as any,
    action: 'DOCUMENT_DELETED',
    resourceType: 'Document',
    resourceId: id,
    description: `Deleted document ${doc.originalName} (${doc.documentId})`,
    ipAddress: ip,
  });

  return { id };
};

export const verifyUserDocumentService = async (
  documentId: string,
  input: { action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'; remarks: string; correctedData?: any; digitalSignature?: any },
  verifierId: string,
  verifierRole: string = 'VERIFIER',
  verifierName: string = 'Authorized Official',
  ip?: string
) => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc) {
    throw new Error('Document not found');
  }

  if (!doc.metadata) doc.metadata = {};

  let targetStatus: DocumentProcessingStatus;
  let auditDescription = '';
  let digitalSignatureObj: any = null;

  if (input.action === 'APPROVED') {
    if (verifierRole === 'OFFICER' || verifierRole === 'ADMIN') {
      // Final Statutory Officer Sign-off
      targetStatus = 'VERIFIED';
      const sigId = `DSC-OFF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      digitalSignatureObj = {
        signatureId: sigId,
        signerId: verifierId,
        signerName: verifierName,
        signerRole: verifierRole,
        signedAt: new Date().toISOString(),
        issuer: 'State Revenue & Cadastral Title Authority (Maharashtra Land Revenue Code Sec 149)',
        certificateStatus: 'FINAL_STATUTORY_SEAL',
        digest: crypto.createHash('sha256').update(`${doc.documentId}:OFFICER_FINAL:${verifierId}:${Date.now()}`).digest('hex'),
        remarks: input.remarks,
      };

      doc.metadata.officerSignature = digitalSignatureObj;
      doc.metadata.finalVerifiedBy = verifierId;
      doc.metadata.finalOfficerName = verifierName;
      doc.metadata.finalVerifiedAt = new Date();
      doc.metadata.finalVerificationRemarks = input.remarks;
      doc.metadata.digitalSignatureId = sigId;

      auditDescription = `Officer ${verifierName} executed final statutory verification with digital signature (${sigId}). Document permanently certified and sealed as VERIFIED. Remarks: ${input.remarks}`;
    } else {
      // Verifier Initial Review & Sign-off -> Transitions to PENDING_OFFICER_REVIEW
      targetStatus = 'PENDING_OFFICER_REVIEW';
      const sigId = `DSC-VER-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      digitalSignatureObj = {
        signatureId: sigId,
        signerId: verifierId,
        signerName: verifierName,
        signerRole: 'VERIFIER',
        signedAt: new Date().toISOString(),
        issuer: 'National Land Record Verification Authority (ILRDVS)',
        certificateStatus: 'AUTHENTICATED_INITIAL_VERIFICATION',
        digest: crypto.createHash('sha256').update(`${doc.documentId}:VERIFIER:${verifierId}:${Date.now()}`).digest('hex'),
        remarks: input.remarks,
      };

      doc.metadata.verifierSignature = digitalSignatureObj;
      doc.metadata.initialVerifiedBy = verifierId;
      doc.metadata.initialVerifierName = verifierName;
      doc.metadata.initialVerifiedAt = new Date();
      doc.metadata.initialVerificationRemarks = input.remarks;

      auditDescription = `Verifier ${verifierName} completed initial verification with digital signature (${sigId}). Document forwarded to Officer review queue (PENDING_OFFICER_REVIEW). Remarks: ${input.remarks}`;
    }
  } else if (input.action === 'REJECTED') {
    targetStatus = 'REJECTED';
    auditDescription = `${verifierRole} ${verifierName} rejected document ${doc.documentId}. Remarks: ${input.remarks}`;
    doc.metadata.rejectedBy = verifierId;
    doc.metadata.rejectedByName = verifierName;
    doc.metadata.rejectedAt = new Date();
    doc.metadata.rejectionRemarks = input.remarks;
  } else {
    targetStatus = 'NEEDS_REVIEW';
    auditDescription = `${verifierRole} ${verifierName} marked document ${doc.documentId} for clarification/needs review. Remarks: ${input.remarks}`;
    doc.metadata.clarificationRequestedBy = verifierId;
    doc.metadata.clarificationRequestedByName = verifierName;
    doc.metadata.clarificationRequestedAt = new Date();
    doc.metadata.clarificationRemarks = input.remarks;
  }

  doc.processingStatus = targetStatus;
  doc.metadata.verificationRemarks = input.remarks;
  doc.metadata.verifiedBy = verifierId;
  doc.metadata.verifiedAt = new Date();
  await doc.save();

  // Also update linked LandRecord if exists
  const linkedRecord = await LandRecord.findOne({ sourceDocument: doc._id });
  if (linkedRecord) {
    if (targetStatus === 'VERIFIED') {
      linkedRecord.verificationStatus = 'VERIFIED';
    } else if (targetStatus === 'PENDING_OFFICER_REVIEW') {
      linkedRecord.verificationStatus = 'NEEDS_REVIEW';
    } else if (targetStatus === 'REJECTED') {
      linkedRecord.verificationStatus = 'REJECTED';
    } else {
      linkedRecord.verificationStatus = 'NEEDS_REVIEW';
    }
    linkedRecord.verifiedBy = verifierId as any;
    linkedRecord.remarks = input.remarks;
    if (input.correctedData) {
      Object.assign(linkedRecord, input.correctedData);
    }
    await linkedRecord.save();
  }

  await logAudit({
    userId: verifierId as any,
    action:
      targetStatus === 'VERIFIED'
        ? 'RECORD_VERIFIED'
        : targetStatus === 'PENDING_OFFICER_REVIEW'
        ? 'RECORD_CORRECTED'
        : targetStatus === 'REJECTED'
        ? 'RECORD_REJECTED'
        : 'RECORD_CORRECTED',
    resourceType: 'Document',
    resourceId: doc._id.toString(),
    description: auditDescription,
    ipAddress: ip,
  });

  // Asynchronously dispatch ground-truth feedback to AI microservice for continuous learning
  try {
    const { reportCorrectionToAIService } = await import('./ai-extraction.service.js');
    reportCorrectionToAIService({
      documentId: doc.documentId,
      originalData: (doc.metadata?.aiExtraction?.entities as any) || (linkedRecord ? linkedRecord.toObject() : {}),
      correctedData: input.correctedData || (linkedRecord ? linkedRecord.toObject() : {}),
      originalOcrText: doc.metadata?.aiExtraction?.rawTextSnippet || doc.metadata?.extractedText || '',
      verifierRemarks: input.remarks || '',
    }).catch(err => console.warn('[AI-Feedback] Async reporting error:', err));
  } catch (err: any) {
    console.warn('[AI-Feedback] Failed to trigger feedback:', err);
  }

  const updatedDoc = await DocumentModel.findById(doc._id)
    .populate('uploadedBy', 'name email role department district')
    .lean();

  return {
    ...updatedDoc,
    fileUrl: `/uploads/${doc.fileName}`,
    landRecord: linkedRecord || null,
  };
};

