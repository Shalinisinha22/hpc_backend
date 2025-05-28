import express from 'express';
import { createHall, getAllHalls } from '../controllers/hallController';
import { roleAuth } from '../middleware/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create', auth, roleAuth(['admin']), createHall);
router.get('/', getAllHalls);

export default router;