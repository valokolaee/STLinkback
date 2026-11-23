// src/routes/auth.routes.ts
import { Router } from 'express';
import transactionsController from '../../controllers/transactions.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();


router.get('/', authenticate, transactionsController.getAll);
router.get('/:id', authenticate, transactionsController.getOne);
router.post('/getAllBy', authenticate, transactionsController.getAllBy);


router.post('/', authenticate, transactionsController.create);
// router.put('/', authenticate, deviceController.update);
// router.delete('/:id', authenticate, deviceController.delete);

// router.get('/', authenticate, deviceController.getOne);


export default router;
