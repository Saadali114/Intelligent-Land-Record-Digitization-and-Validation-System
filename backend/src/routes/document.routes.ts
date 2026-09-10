import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  extractDocument,
  verifyUserDocument,
  publicVerifyDocument,
  upload,
} from '../controllers/document.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { DocumentQuerySchema } from '../schemas/document.schema.js';

const router = Router();

// Public verification endpoint: Accessible by QR scan without login
router.get('/public-verify/:query', publicVerifyDocument);

router.use(authenticate);

// View list and details: allowed for all authenticated roles
router.get('/', validateQuery(DocumentQuerySchema), getDocuments);
router.get('/:id', getDocumentById);

// Upload: ADMIN, VERIFIER (Officers cannot upload documents)
router.post(
  '/',
  authorize(['ADMIN', 'VERIFIER']),
  upload.single('file'),
  uploadDocument
);

// Trigger AI OCR & Cadastral Entity Extraction: ADMIN, OFFICER, VERIFIER
router.post(
  '/:id/extract',
  authorize(['ADMIN', 'OFFICER', 'VERIFIER']),
  extractDocument
);

// Verifier / Officer / Admin verifies user uploaded document
router.post(
  '/:id/verify',
  authorize(['ADMIN', 'OFFICER', 'VERIFIER']),
  verifyUserDocument
);

// Delete: ADMIN only
router.delete('/:id', authorize(['ADMIN']), deleteDocument);

export default router;
