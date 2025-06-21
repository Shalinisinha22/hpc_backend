import express from 'express';
import { DiningBookingController } from '../controllers/diningBookingController';
import { auth } from '../middleware/auth';

const router = express.Router();
const diningBookingController = new DiningBookingController();

// Public route to create a booking
router.post('/', diningBookingController.createBooking);

// Protected routes
router.get('/', auth, diningBookingController.getAllBookings);
router.get('/:id', auth, diningBookingController.getBookingById);
router.delete('/:id', auth, diningBookingController.deleteBooking);

export default router;
