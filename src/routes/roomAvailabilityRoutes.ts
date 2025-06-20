import express from 'express';
import { RoomAvailabilityController } from '../controllers/roomAvailabilityController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const roomAvailabilityController = new RoomAvailabilityController();

// Public routes
router.get('/available', roomAvailabilityController.getAvailableRooms);

// Protected routes (authentication required)
router.get('/unavailabilities', auth, roomAvailabilityController.getRoomUnavailabilities);
router.get('/unavailabilities/:id', auth, roomAvailabilityController.getRoomUnavailabilityById);

// Admin routes (admin only)
router.post('/unavailable', auth, roomAvailabilityController.setRoomUnavailability);
router.put('/unavailabilities/:id', auth, roomAvailabilityController.updateRoomUnavailability);
router.delete('/unavailabilities/:id', auth, roomAvailabilityController.deleteRoomUnavailability);
router.post('/update-statuses', auth, roomAvailabilityController.updateRoomStatuses);

export default router;