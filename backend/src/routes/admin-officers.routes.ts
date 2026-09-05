import { Router } from 'express';
import {
  listOfficerApplications,
  getOfficerApplicationById,
  approveOfficerApplication,
  rejectOfficerApplication,
  requestOfficerClarification,
} from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import {
  RejectOfficerSchema,
  ClarificationOfficerSchema,
} from '../schemas/registration.schema.js';

const router = Router();

// Strictly Admin-only authorization
router.use(authenticate, authorize(['ADMIN']));

router.get('/', listOfficerApplications);
router.get('/:id', getOfficerApplicationById);
router.post('/:id/approve', approveOfficerApplication);
router.post('/:id/reject', validateBody(RejectOfficerSchema), rejectOfficerApplication);
router.post(
  '/:id/request-clarification',
  validateBody(ClarificationOfficerSchema),
  requestOfficerClarification
);

export default router;
