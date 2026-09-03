import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
