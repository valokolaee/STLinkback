// src/routes/bank-service.routes.ts
import { Router } from 'express';
import { BankServiceController } from '../controllers/bank-service.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', BankServiceController.getBankServices);
router.post('/', authenticate, BankServiceController.createBankService);
router.put('/:serviceId', authenticate, BankServiceController.updateBankService);
router.delete('/:serviceId', authenticate, BankServiceController.deleteBankService);

export default router;