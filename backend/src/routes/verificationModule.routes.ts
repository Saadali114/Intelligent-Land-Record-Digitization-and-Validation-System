import { Router } from 'express';
import multer from 'multer';
import { VerificationModuleController } from '../controllers/verificationModule.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.use(authenticate);

// Citizen verification submission & applications
router.post('/upload', upload.single('file'), VerificationModuleController.uploadAndVerify);
router.get('/citizen/applications', VerificationModuleController.getCitizenWorkflows);
router.post('/:id/clarification', VerificationModuleController.respondToClarification);

// Officer review queue & decisions
router.get(
  '/officer/queue',
  authorize(['ADMIN', 'OFFICER', 'VERIFIER']),
  VerificationModuleController.getOfficerQueue
);
router.post(
  ('/:id/officer-decision' as string),
  authorize(['ADMIN', 'OFFICER']),
  VerificationModuleController.submitOfficerDecision
);

// Detail query by applicationId / Mongo ID
router.get('/:id', VerificationModuleController.getWorkflowDetail);

// Demo cadastral records (Admin CRUD + Read for all)
router.get('/demo-records/list', VerificationModuleController.listDemoLandRecords);
router.post(
  '/demo-records',
  authorize(['ADMIN']),
  VerificationModuleController.createDemoLandRecord
);
router.put(
  ('/demo-records/:id' as string),
  authorize(['ADMIN']),
  VerificationModuleController.updateDemoLandRecord
);
router.delete(
  ('/demo-records/:id' as string),
  authorize(['ADMIN']),
  VerificationModuleController.deleteDemoLandRecord
);

export default router;
