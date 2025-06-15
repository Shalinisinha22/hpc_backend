import express from 'express';
import { HallController } from '../controllers/hallController';
import { roleAuth, auth } from '../middleware/auth';

const router = express.Router();
const hallController = new HallController();

// Public routes
router.get('/', hallController.getHalls);
router.get('/:id', hallController.getHallById);

// Protected routes (admin only)
router.post('/create', auth, roleAuth(['admin']), hallController.createHall);
router.put('/:id', auth, roleAuth(['admin']), hallController.updateHall);
router.delete('/:id', auth, roleAuth(['admin']), hallController.deleteHall);

export default router;