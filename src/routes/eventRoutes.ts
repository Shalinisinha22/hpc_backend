import { Router } from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();

router.post('/', auth,roleAuth(['admin']), createEvent);
router.get('/', getAllEvents);

export default router;
