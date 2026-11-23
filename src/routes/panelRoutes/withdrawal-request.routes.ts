import { Router } from 'express';
import controller from '../../controllers/withdrawal-request.controller';
import { authenticate } from '../../middleware/auth.middleware';


const router = Router();


router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getOne);
router.post('/getAllBy', authenticate, controller.getAllBy);


router.post('/', authenticate, controller.create);
router.put('/', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

export default router;
