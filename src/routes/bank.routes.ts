// src/routes/bank.routes.ts
import { Router } from 'express';
import { BankController } from '../controllers/bank.controller';
import { authenticate } from '../middleware/auth.middleware';
import bankServiceRoutes from './bank-service.routes'; 

const router = Router();

router.get('/', BankController.getAllBanks);
router.get('/:id', BankController.getBankById);
router.post('/', authenticate, BankController.createBank);
router.put('/', authenticate, BankController.updateBank);
router.delete('/:id', authenticate, BankController.deleteBank);

// Mount bank service routes
router.use('/:bankId/services', bankServiceRoutes);

export default router;