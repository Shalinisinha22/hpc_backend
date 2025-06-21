import express from 'express';
import { RoomController } from '../controllers/roomController';
import { RoomAvailabilityController } from '../controllers/roomAvailabilityController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const roomController = new RoomController();
const roomAvailabilityController = new RoomAvailabilityController();

const allowedRoles = ['admin', 'Front Office', 'HR'];

// Room CRUD routes
router.post('/', auth, roomController.createRoom);
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', auth, roomController.updateRoom);
router.post('/:id/image', auth, roomController.addRoomImage);  

router.delete('/:id/image/:imgId', auth, roomController.deleteRoomImage);
router.delete('/:id', auth, roomController.deleteRoom);

// Room availability routes
router.get('/status/available', auth, roomAvailabilityController.getAvailableRooms);
router.post('/status/unavailable', auth, roomAvailabilityController.setRoomUnavailability);

export default router;