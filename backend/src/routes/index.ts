import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import documentRoutes from './document.routes.js';
import landRecordRoutes from './land-record.routes.js';
import verificationRoutes from './verification.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import auditRoutes from './audit.routes.js';
import verificationWorkflowRoutes from './verificationWorkflow.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/land-records', landRecordRoutes);
router.use('/verification', verificationRoutes);
router.use('/verification-workflow', verificationWorkflowRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit', auditRoutes);

export default router;
