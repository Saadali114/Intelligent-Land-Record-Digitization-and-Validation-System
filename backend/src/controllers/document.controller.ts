import { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createDocumentRecord,
  getDocumentsService,
  getDocumentByIdService,
  deleteDocumentService,
  extractDocumentService,
} from '../services/document.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

// Setup upload directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Allowed file types: Images (jpeg, png, webp, tiff) and PDF
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff',
    'application/pdf',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF, JPEG, PNG, WEBP, and TIFF are accepted.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
});

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }

    if (!req.user) {
      sendError(res, 'Authentication required to upload document', 401);
      return;
    }

    const { language, fileType } = req.body;
    const document = await createDocumentRecord(
      req.file,
      { language, fileType },
      req.user._id.toString(),
      req.ip
    );

    sendSuccess(res, 'Document uploaded successfully', document, 201);
  } catch (error: any) {
    sendError(res, error.message || 'File upload failed', 400);
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { documents, pagination } = await getDocumentsService(req.query as any);
    sendSuccess(res, 'Documents retrieved successfully', documents, 200, pagination);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch documents', 500);
  }
};

export const getDocumentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const document = await getDocumentByIdService(req.params.id);
    sendSuccess(res, 'Document retrieved successfully', document);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch document', 404);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const result = await deleteDocumentService(req.params.id, req.user._id.toString(), req.ip);
    sendSuccess(res, 'Document deleted successfully', result);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete document', 400);
  }
};

export const extractDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required to run AI extraction', 401);
      return;
    }
    const result = await extractDocumentService(req.params.id, req.user._id.toString(), req.ip);
    sendSuccess(res, 'AI extraction completed successfully', result, 200);
  } catch (error: any) {
    sendError(res, error.message || 'AI extraction failed', 400);
  }
};

export const verifyUserDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required to verify document', 401);
      return;
    }

    const { action, remarks, correctedData } = req.body;
    if (!action || !['APPROVED', 'REJECTED', 'NEEDS_REVIEW'].includes(action)) {
      sendError(res, 'Invalid action. Must be APPROVED, REJECTED, or NEEDS_REVIEW', 400);
      return;
    }

    if (!remarks || !remarks.trim()) {
      sendError(res, 'Inspector remarks are mandatory', 400);
      return;
    }

    const { verifyUserDocumentService } = await import('../services/document.service.js');
    const result = await verifyUserDocumentService(
      req.params.id,
      { action, remarks: remarks.trim(), correctedData },
      req.user._id.toString(),
      req.ip
    );

    sendSuccess(res, `Document successfully marked as ${action.toLowerCase()}`, result, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Document verification failed', 400);
  }
};

export const publicVerifyDocument = async (req: any, res: Response): Promise<void> => {
  try {
    const { query } = req.params;
    if (!query || !query.trim()) {
      sendError(res, 'Document identifier is required for verification', 400);
      return;
    }

    const { DocumentModel } = await import('../models/Document.js');
    const { LandRecord } = await import('../models/LandRecord.js');

    const cleanQuery = query.trim();

    // Query by documentId, or mongo/cuid _id, or checksum
    const doc = await DocumentModel.findOne({
      $or: [
        { documentId: cleanQuery },
        { _id: cleanQuery },
        { checksum: cleanQuery },
      ],
    });

    if (!doc) {
      sendError(res, `No registered land document found matching identifier '${cleanQuery}'`, 404);
      return;
    }

    const landRecord = await LandRecord.findOne({ sourceDocument: doc._id });

    sendSuccess(
      res,
      'Official Cadastral Record Verified',
      {
        valid: true,
        documentId: doc.documentId,
        originalName: doc.originalName,
        fileType: doc.fileType,
        processingStatus: doc.processingStatus,
        checksum: doc.checksum,
        uploadedAt: doc.uploadedAt,
        landRecord: landRecord
          ? {
              ownerName: landRecord.ownerName,
              surveyNumber: landRecord.surveyNumber,
              gatNumber: landRecord.gatNumber || null,
              khataNumber: landRecord.khataNumber,
              plotArea: landRecord.plotArea,
              village: landRecord.village,
              tehsil: landRecord.tehsil,
              district: landRecord.district,
              landClassification: landRecord.landClassification,
              ownershipType: landRecord.ownershipType,
              mutationNumber: landRecord.mutationNumber,
              verificationStatus: landRecord.verificationStatus,
            }
          : null,
        digitalSeal: {
          authority: 'Government of Maharashtra • Land Records & Revenue Directorate',
          system: 'ILRDVS Cadastral Verification & Validation Service',
          verifiedAt: new Date().toISOString(),
          certificateNo: `CERT-ILRDVS-${doc.documentId}`,
          securityHash: doc.checksum || 'VERIFIED-SEAL',
        },
      },
      200
    );
  } catch (error: any) {
    sendError(res, error.message || 'Public document verification query failed', 500);
  }
};

