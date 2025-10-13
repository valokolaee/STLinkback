// routes/images.ts
import { Router } from 'express';
import { ImageController } from '../controllers/Image.controller';
 
const router = Router();

// Get all images
router.get('/:pool/:filename', ImageController.getImage);
// router.get('/avatar/:filename', ImageController.getImage);
// router.get('/bank/:filename', ImageController.getImage);

// router.get('/avatar', ImageController.getImages);
// router.get('/bank', ImageController.getImages);

// Get images with pagination
router.get('/paginated', ImageController.getImagesPaginated);

// Get single image
router.get('/:filename', ImageController.getImage);

export default router;