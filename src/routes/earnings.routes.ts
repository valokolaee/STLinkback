// src/routes/auth.routes.ts
import { Router } from 'express';
import deviceController from '../controllers/device.controller';
import { authenticate } from '../middleware/auth.middleware';
import earningsController from '../controllers/earnings.controller';

const router = Router();


router.get('/', authenticate, earningsController.getAll);
router.get('/:id', authenticate, earningsController.getOne);

router.post('/', authenticate, earningsController.create);
router.put('/', authenticate, earningsController.update);
router.delete('/', authenticate, earningsController.delete);

export default router;
