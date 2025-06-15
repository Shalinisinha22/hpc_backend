import express from 'express';
import { RoomController } from '../controllers/roomController';
import { RoomAvailabilityController } from '../controllers/roomAvailabilityController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const roomController = new RoomController();
const roomAvailabilityController = new RoomAvailabilityController();

const allowedRoles = ['admin', 'Front Office', 'HR'];

// Room CRUD routes
router.post('/', auth, roleAuth(allowedRoles), roomController.createRoom);
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', auth, roleAuth(allowedRoles), roomController.updateRoom);
router.delete('/:id', auth, roleAuth(allowedRoles), roomController.deleteRoom);

// Room availability routes
router.get('/status/available', auth, roomAvailabilityController.getAvailableRooms);
router.post('/status/unavailable', auth, roleAuth(allowedRoles), roomAvailabilityController.setRoomUnavailability);

export default router;