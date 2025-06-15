import express from 'express';
import { EventController } from '../controllers/eventController';
import { auth } from '../middleware/auth';

const router = express.Router();
const eventController = new EventController();

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (authentication required)
router.post('/', auth, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

export default router;