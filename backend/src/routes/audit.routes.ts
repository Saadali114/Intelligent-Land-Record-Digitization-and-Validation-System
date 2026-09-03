import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate, authorize(['ADMIN']));
router.get('/', getAuditLogs);

export default router;
