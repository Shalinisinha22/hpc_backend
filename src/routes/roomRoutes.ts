import express from 'express';
import { RoomController } from '../controllers/roomController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();
const roomController = new RoomController();

router.post('/', adminAuth, roomController.createRoom);
router.get('/', auth, roomController.getRooms);
router.get('/:id', auth, roomController.getRoomById);
router.put('/:id', adminAuth, roomController.updateRoom);
router.delete('/:id', adminAuth, roomController.deleteRoom);

export default router;