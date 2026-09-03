import { Router } from 'express';
import {
  getLandRecords,
  getLandRecordById,
  createLandRecord,
  updateLandRecord,
  deleteLandRecord,
  getFilterMetadata,
} from '../controllers/land-record.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import {
  CreateLandRecordSchema,
  UpdateLandRecordSchema,
  LandRecordQuerySchema,
} from '../schemas/land-record.schema.js';

const router = Router();

router.use(authenticate);

router.get('/meta/filters', getFilterMetadata);
router.get('/', validateQuery(LandRecordQuerySchema), getLandRecords);
router.get('/:id', getLandRecordById);

// Create: ADMIN, OFFICER
router.post(
  '/',
  authorize(['ADMIN', 'OFFICER']),
  validateBody(CreateLandRecordSchema),
  createLandRecord
);

// Update: ADMIN, OFFICER, VERIFIER
router.put(
  '/:id',
  authorize(['ADMIN', 'OFFICER', 'VERIFIER']),
  validateBody(UpdateLandRecordSchema),
  updateLandRecord
);

// Delete: ADMIN only
router.delete('/:id', authorize(['ADMIN']), deleteLandRecord);

export default router;
