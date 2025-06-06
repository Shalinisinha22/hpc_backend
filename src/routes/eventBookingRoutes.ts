import express, { Response, NextFunction, RequestHandler } from 'express';
import { EventBookingController } from '../controllers/eventBookingController';
import { auth, roleAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const eventBookingController = new EventBookingController();

const allowedRoles = ['admin', 'Front Office', 'HR'];

// Helper to wrap async route handlers and catch errors
function asyncHandler(fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };
}

router.post('/', auth, async (req, res, next) => {
  try {
    await eventBookingController.createEventBooking(req, res);
  } catch (err) {
    next(err);
  }
});


router.get('/', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await eventBookingController.getEventBookings(req, res);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', auth, async (req, res, next) => {
  try {
    await eventBookingController.getEventBookingById(req, res);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await eventBookingController.updateEventBooking(req, res);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await eventBookingController.deleteEventBooking(req, res);
  } catch (err) {
    next(err);
  }
});


router.get('/status/:status', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await eventBookingController.getEventBookingsByStatus(req, res);
  } catch (err) {
    next(err);
  }
});


router.get('/date-range/search', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await eventBookingController.getEventBookingsByDateRange(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;