import express from 'express';
import { HallController } from '../controllers/hallController';
import { roleAuth, auth } from '../middleware/auth';

const router = express.Router();
const hallController = new HallController();

// Public routes
router.get('/', hallController.getHalls);
router.get('/hallImages', hallController.getAllHallImages);
router.get('/:id', hallController.getHallById);

// Protected routes (admin only)
router.post('/create', auth, hallController.createHall);
router.put('/:id', auth, hallController.updateHall);
router.delete('/:id', auth, hallController.deleteHall);
router.post('/:id/image', auth, hallController.addHallImage);
router.delete('/:id/image/:imgId', auth, hallController.deleteHallImage);

export default router;