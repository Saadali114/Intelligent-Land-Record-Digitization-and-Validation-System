import path from 'path';
import fs from 'fs';
import { DocumentModel, IDocument, DocumentProcessingStatus } from '../models/Document.js';
import { LandRecord } from '../models/LandRecord.js';
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
    uploadedAt: new Date(),
    metadata: {
      originalSize: file.size,
      mimeType: file.mimetype,
      encoding: file.encoding,
      uploadSource: 'Web Portal',
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
  const docIds = documents.map((d) => d._id);
  const landRecords = await LandRecord.find({ sourceDocument: { $in: docIds } }).lean();
  const lrMap = new Map(landRecords.map((lr) => [lr.sourceDocument?.toString(), lr]));

  const enrichedDocs = documents.map((d) => ({
    ...d,
    fileUrl: `/uploads/${d.fileName}`,
    landRecord: lrMap.get(d._id.toString()) || null,
  }));

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
  input: { action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'; remarks: string; correctedData?: any },
  verifierId: string,
  ip?: string
) => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc) {
    throw new Error('Document not found');
  }

  const targetStatus: DocumentProcessingStatus =
    input.action === 'APPROVED'
      ? 'VERIFIED'
      : input.action === 'REJECTED'
      ? 'REJECTED'
      : 'NEEDS_REVIEW';

  doc.processingStatus = targetStatus;
  if (!doc.metadata) doc.metadata = {};
  doc.metadata.verificationRemarks = input.remarks;
  doc.metadata.verifiedBy = verifierId;
  doc.metadata.verifiedAt = new Date();
  await doc.save();

  // Also update linked LandRecord if exists
  const linkedRecord = await LandRecord.findOne({ sourceDocument: doc._id });
  if (linkedRecord) {
    linkedRecord.verificationStatus =
      input.action === 'APPROVED' ? 'VERIFIED' : input.action === 'REJECTED' ? 'REJECTED' : 'NEEDS_REVIEW';
    linkedRecord.verifiedBy = verifierId as any;
    linkedRecord.remarks = input.remarks;
    if (input.correctedData) {
      Object.assign(linkedRecord, input.correctedData);
    }
    await linkedRecord.save();
  }

  await logAudit({
    userId: verifierId as any,
    action: input.action === 'APPROVED' ? 'RECORD_VERIFIED' : input.action === 'REJECTED' ? 'RECORD_REJECTED' : 'RECORD_CORRECTED',
    resourceType: 'Document',
    resourceId: doc._id.toString(),
    description: `User document ${doc.originalName} (${doc.documentId}) verified with verdict: ${input.action}. Remarks: ${input.remarks}`,
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

