// src/routes/pool.routes.ts
import { Router } from 'express';
import { PoolController } from '../controllers/pool.controller';
import { authenticate } from '../middleware/auth.middleware';
import poolServiceRoutes from './pool-service.routes';

const router = Router();

router.get('/', PoolController.getAllPools);
router.get('/:id', PoolController.getPoolById);
router.post('/', authenticate, PoolController.createPool);
router.put('/', authenticate, PoolController.updatePool);
router.delete('/:id', authenticate, PoolController.deletePool);

// Mount pool service routes
router.use('/:poolId/services', poolServiceRoutes);

export default router;