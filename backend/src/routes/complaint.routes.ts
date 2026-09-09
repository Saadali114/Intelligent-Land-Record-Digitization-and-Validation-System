import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
} from '../controllers/complaint.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Allow authenticated users (citizens can lodge, officers/admins can review and resolve)
router.use(authenticate);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.patch('/:id/status', updateComplaintStatus);

export default router;
