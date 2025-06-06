import { Router } from 'express';
import { createEvent, deleteEvent, getAllEvents, updateEvent } from '../controllers/eventController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();

router.post('/', auth, roleAuth(['admin']), createEvent);
router.get('/', auth, getAllEvents);
router.put('/:id', auth, roleAuth(['admin']), updateEvent);
router.delete('/:id', auth, roleAuth(['admin']), deleteEvent);

export default router;
