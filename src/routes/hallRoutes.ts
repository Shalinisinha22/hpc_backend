import express from 'express';
import { createHall, deleteHall, getAllHalls, getHallById, updateHall } from '../controllers/hallController';
import { roleAuth } from '../middleware/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create', auth, roleAuth(['admin']), createHall);
router.get('/', getAllHalls);
router.get('/:id', getHallById);
router.put('/:id', auth, roleAuth(['admin']),updateHall);
router.delete('/:id', auth, roleAuth(['admin']), deleteHall )

export default router;