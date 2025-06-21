import express from 'express';
import { DiningController } from '../controllers/diningController';
import { auth } from '../middleware/auth';

const router = express.Router();
const diningController = new DiningController();

// Public routes
router.get('/', diningController.getAllDining);
router.get('/:id', diningController.getDiningById);

// Protected routes
router.post('/', auth, diningController.createDining);
router.put('/:id', auth, diningController.updateDining);
router.delete('/:id', auth, diningController.deleteDining);

// Image routes
router.post('/:id/image', auth, diningController.addDiningImage);
router.delete('/:id/image/:imgId', auth, diningController.deleteDiningImage);

export default router;
