import express from 'express';
import { BookingController } from '../controllers/bookingController';
import { auth, roleAuth, optionalAuth } from '../middleware/auth';

const router = express.Router();
const bookingController = new BookingController();

// Create booking (public with optional auth)
router.post('/', optionalAuth, bookingController.createBooking);

// My bookings route (authenticated users)
router.get('/my', auth, bookingController.getBookingsByUserToken);

// User bookings route (admin only)
router.get('/user/:userId', auth, roleAuth(['admin']), bookingController.getBookingsByUserId);

// Get all bookings (admin only)
router.get('/', auth, roleAuth(['admin']), bookingController.getAllBookings);

// Get specific booking (admin only)
router.get('/:id', auth, roleAuth(['admin']), bookingController.getBooking);

// Update booking (admin only)
router.put('/:id', auth, roleAuth(['admin']), bookingController.updateBooking);

// Delete booking (admin only)
router.delete('/:id', auth, roleAuth(['admin']), bookingController.deleteBooking);

export default router;