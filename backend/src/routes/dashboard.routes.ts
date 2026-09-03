import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All authenticated roles can access the dashboard
router.use(authenticate);
router.get('/stats', getDashboardStats);

export default router;
