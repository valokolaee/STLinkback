// src/routes/auth.routes.ts
import { Router } from 'express';
import earningsController from '../../controllers/tst.controller';
import { authenticate } from '../../middleware/auth.middleware';

const
    router = Router();


router.get('/', authenticate, earningsController.getAll);
router.get('/:id', authenticate, earningsController.getOne);
router.post('/getAllBy', authenticate, earningsController.getAllBy);
router.post('/getAllBy', authenticate, earningsController.getAllBy);


router.post('/', authenticate, earningsController.create);
router.put('/', authenticate, earningsController.update);
router.delete('/:id', authenticate, earningsController.delete);

export default router;
