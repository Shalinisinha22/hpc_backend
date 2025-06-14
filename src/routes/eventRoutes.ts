import express from 'express';
import { EventController } from '../controllers/eventController';
import { auth } from '../middleware/auth';

const router = express.Router();
const eventController = new EventController();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', auth, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

export default router;