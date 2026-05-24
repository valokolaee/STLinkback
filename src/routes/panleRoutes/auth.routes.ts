// src/routes/auth.routes.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import authController from '../../controllers/agentAuth.controller';

const router = Router();

// router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
