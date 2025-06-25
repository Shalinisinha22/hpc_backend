import express from 'express';
import { BookingController } from '../controllers/bookingController';
import { auth, roleAuth, optionalAuth } from '../middleware/auth';

const router = express.Router();
const bookingController = new BookingController();

// Create booking (public with optional auth)
router.post('/', optionalAuth, (req, res) => bookingController.createBooking(req, res));

// My bookings route (authenticated users)
router.get('/my', auth, (req, res) => bookingController.getBookingsByUserToken(req, res));

// User bookings route (admin only)
router.get('/user/:userId', auth, (req, res) => bookingController.getBookingsByUserId(req, res));

// Get all bookings (admin only)
router.get('/', auth, (req, res) => bookingController.getAllBookings(req, res));

// Get bookings count (admin only) - must be before /:id route
router.get('/counter', auth, (req, res) => bookingController.getCountOfBookings(req, res));

//get booking revenue (admin only)
router.get('/revenue', auth, (req, res) => bookingController.getTotalRevenue(req, res));

//cancelledBookings (admin only)
router.get('/cancelled', auth, (req, res) => bookingController.getFailedBookings(req, res));

// Get specific booking (admin only)
router.get('/:id', auth, (req, res) => bookingController.getBooking(req, res));

// Update booking (admin only)
router.put('/:id', auth, (req, res) => bookingController.updateBooking(req, res));

// Delete booking (admin only)
router.delete('/:id', auth, (req, res) => bookingController.deleteBooking(req, res));

export default router;