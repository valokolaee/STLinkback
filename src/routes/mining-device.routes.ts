// src/routes/auth.routes.ts
import { Router } from 'express';
import deviceController from '../controllers/mining-device.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


router.get('/', authenticate, deviceController.getAll);
router.get('/:id', authenticate, deviceController.getOne);
router.post('/getAllBy', authenticate, deviceController.getAllBy);


router.post('/', authenticate, deviceController.create);
router.put('/', authenticate, deviceController.update);
router.delete('/:id', authenticate, deviceController.delete);

// router.get('/', authenticate, deviceController.getOne);


export default router;
