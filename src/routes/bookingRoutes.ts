import express from 'express';
import { BookingController } from '../controllers/bookingController';
import { auth, roleAuth, optionalAuth } from '../middleware/auth';

const router = express.Router();
const bookingController = new BookingController();

// Create booking (public with optional auth)
router.post('/', auth, bookingController.createBooking);

// My bookings route (authenticated users)
router.get('/my', auth, bookingController.getBookingsByUserToken);

// User bookings route (admin only)
router.get('/user/:userId', auth, bookingController.getBookingsByUserId);

// Get all bookings (admin only)
router.get('/', auth, bookingController.getAllBookings);

// Get bookings count (admin only) - must be before /:id route
router.get('/counter', auth, bookingController.getCountOfBookings);

//get booking revenue (admin only)
router.get('/revenue', auth, bookingController.getTotalRevenue);

//cancelledBookings (admin only)
router.get('/cancelled', auth, bookingController.getFailedBookings);

// Get specific booking (admin only)
router.get('/:id', auth, bookingController.getBooking);

// Update booking (admin only)
router.put('/:id', auth, bookingController.updateBooking);

// Delete booking (admin only)
router.delete('/:id', auth, bookingController.deleteBooking);

export default router;