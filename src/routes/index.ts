import express from 'express';

import roomRoutes from './roomRoutes';

const router = express.Router();


router.use('/rooms', roomRoutes);

export default router;