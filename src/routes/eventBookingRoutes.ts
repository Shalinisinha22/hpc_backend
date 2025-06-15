import express from 'express';
import { EventBookingController } from '../controllers/eventBookingController';
import { auth } from '../middleware/auth';

const router = express.Router();
const eventBookingController = new EventBookingController();

router.get('/', auth, eventBookingController.getEventBookings);
router.get('/:id', auth, eventBookingController.getEventBookingById);
router.post('/', auth, eventBookingController.createEventBooking);
router.put('/:id', auth, eventBookingController.updateEventBooking);
router.delete('/:id', auth, eventBookingController.deleteEventBooking);

export default router;