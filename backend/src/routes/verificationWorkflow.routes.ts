import { Router } from 'express';
import {
  startVerificationSession,
  getVerificationSessionDetails,
  recordOfficerDecision,
  getDemoCases,
} from '../controllers/verificationWorkflow.controller.js';

const router = Router();

router.post('/start', startVerificationSession);
router.get('/demo-cases', getDemoCases);
router.get('/:id', getVerificationSessionDetails);
router.post('/:id/officer-decision', recordOfficerDecision);

export default router;
