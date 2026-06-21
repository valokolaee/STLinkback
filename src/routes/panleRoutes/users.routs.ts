// src/routes/auth.routes.ts
import { Router } from 'express';
import usersController from '../../controllers/users.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();


router.get('/', authenticate, usersController.getAll);
router.get('/:id', authenticate, usersController.getOne);
router.post('/getAllBy', authenticate, usersController.getAllBy);
router.post('/search', authenticate, usersController.search);


router.post('/', authenticate, usersController.create);
router.put('/', authenticate, usersController.update);
router.delete('/:id', authenticate, usersController.delete);

export default router;
