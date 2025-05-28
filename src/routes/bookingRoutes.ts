import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();
const bookingController = new BookingController();

// My bookings route
router.get('/my', auth, async (req, res, next) => {
    try {
        await bookingController.getBookingsByUserToken(req, res);
    } catch (err) {
        next(err);
    }
});

// User bookings route (admin only)
router.get('/user/:userId', auth, roleAuth(['admin']), async (req, res, next) => {
    try {
        await bookingController.getBookingsByUserId(req, res);
    } catch (err) {
        next(err);
    }
});

// Create booking
router.post('/', auth, async (req, res, next) => {
    try {
        await bookingController.createBooking(req, res);
    } catch (err) {
        next(err);
    }
});

// Get all bookings (admin only)
router.get('/', auth, roleAuth(['admin']), async (req, res, next) => {
    try {
        await bookingController.getAllBookings(req, res);
    } catch (err) {
        next(err);
    }
});

// Get specific booking (admin only)
router.get('/:id', auth, roleAuth(['admin']), async (req, res, next) => {
    try {
        await bookingController.getBooking(req, res);
    } catch (err) {
        next(err);
    }
});

// Update booking (admin only)
router.put('/:id', auth, roleAuth(['admin']), async (req, res, next) => {
    try {
        await bookingController.updateBooking(req, res);
    } catch (err) {
        next(err);
    }
});

// Delete booking (admin only)
router.delete('/:id', auth, roleAuth(['admin']), async (req, res, next) => {
    try {
        await bookingController.deleteBooking(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;