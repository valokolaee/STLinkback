// src/routes/pool-service.routes.ts
import { Router } from 'express';
import { PoolServiceController } from '../controllers/pool-service.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true }); 

router.get('/', PoolServiceController.getPoolServices);

router.post('/', authenticate, PoolServiceController.createPoolService);

router.put('/:serviceId', authenticate, PoolServiceController.updatePoolService);

router.delete('/:serviceId', authenticate, PoolServiceController.deletePoolService);

export default router;