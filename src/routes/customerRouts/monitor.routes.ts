// src/routes/auth.routes.ts
import { Router } from 'express';
import controller from '../../controllers/monitor.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();



router.post('/getAllBy', authenticate, controller.getAllBy);
router.get('/', controller.getAll);



export default router;
