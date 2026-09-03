import { Router } from 'express';
import {
  getVerificationQueue,
  getVerificationHistory,
  verifyRecord,
} from '../controllers/verification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { VerifyRecordSchema } from '../schemas/verification.schema.js';

const router = Router();

router.use(authenticate);

// View queue: ADMIN, OFFICER, VERIFIER
router.get('/queue', authorize(['ADMIN', 'OFFICER', 'VERIFIER']), getVerificationQueue);

// View history for record: ADMIN, OFFICER, VERIFIER
router.get('/history/:recordId', authorize(['ADMIN', 'OFFICER', 'VERIFIER']), getVerificationHistory);

// Perform verification action: ADMIN, VERIFIER
router.post(
  '/:recordId',
  authorize(['ADMIN', 'VERIFIER']),
  validateBody(VerifyRecordSchema),
  verifyRecord
);

export default router;
