import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  upload,
} from '../controllers/document.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { DocumentQuerySchema } from '../schemas/document.schema.js';

const router = Router();

router.use(authenticate);

// View list and details: allowed for all authenticated roles
router.get('/', validateQuery(DocumentQuerySchema), getDocuments);
router.get('/:id', getDocumentById);

// Upload: ADMIN, OFFICER
router.post(
  '/',
  authorize(['ADMIN', 'OFFICER']),
  upload.single('file'),
  uploadDocument
);

// Delete: ADMIN only
router.delete('/:id', authorize(['ADMIN']), deleteDocument);

export default router;
