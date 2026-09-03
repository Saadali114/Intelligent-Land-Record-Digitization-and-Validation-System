import path from 'path';
import fs from 'fs';
import { DocumentModel, IDocument, DocumentProcessingStatus } from '../models/Document.js';
import { DocumentQueryInput } from '../schemas/document.schema.js';
import { PaginationMeta } from '../utils/response.js';
import { logAudit } from '../utils/audit.js';

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
      futureAiPipeline: {
        ocrReady: true,
        recommendedEngine: metadata.language === 'Marathi' ? 'Marathi-Tesseract-TrOCR' : 'Standard-OCR',
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

  return doc.populate('uploadedBy', 'name email role department district');
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

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };

  return { documents, pagination };
};

export const getDocumentByIdService = async (id: string) => {
  const doc = await DocumentModel.findById(id)
    .populate('uploadedBy', 'name email role department district')
    .lean();
  if (!doc) {
    throw new Error('Document not found');
  }
  return doc;
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
