import express from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);

export default router;