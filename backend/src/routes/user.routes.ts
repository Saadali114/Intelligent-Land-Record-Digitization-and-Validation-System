import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpdateStatusSchema,
  UserQuerySchema,
} from '../schemas/user.schema.js';

const router = Router();

// All user management routes require ADMIN privileges
router.use(authenticate, authorize(['ADMIN']));

router.get('/', validateQuery(UserQuerySchema), getUsers);
router.get('/:id', getUserById);
router.post('/', validateBody(CreateUserSchema), createUser);
router.put('/:id', validateBody(UpdateUserSchema), updateUser);
router.patch('/:id/status', validateBody(UpdateStatusSchema), updateUserStatus);
router.delete('/:id', deleteUser);

export default router;
