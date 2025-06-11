import express, { Response, NextFunction, RequestHandler } from 'express';
import { RoomController } from '../controllers/roomController';
import { auth, roleAuth, AuthRequest } from '../middleware/auth';
import { setRoomUnavailability, getAvailableRooms } from '../controllers/roomAvailabilityController';

const router = express.Router();
const roomController = new RoomController();

const allowedRoles = ['admin', 'Front Office', 'HR'];

// Helper to wrap async route handlers and catch errors
function asyncHandler(fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };
}

router.post('/', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await roomController.createRoom(req, res);
  } catch (err) {
    next(err);
  }
});
router.get('/',  async (req, res, next) => {
  try {
    await roomController.getRooms(req, res);
  } catch (err) {
    next(err);
  }
});
router.get('/:id',async (req, res, next) => {
  try {
    await roomController.getRoomById(req, res);
  } catch (err) {
    next(err);
  }
});
router.put('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await roomController.updateRoom(req, res);
  } catch (err) {
    next(err);
  }
});
router.delete('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await roomController.deleteRoom(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/status/available', auth, getAvailableRooms); // Changed path
router.post('/status/unavailable', auth, roleAuth(allowedRoles), setRoomUnavailability);

export default router;