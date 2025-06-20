import express from 'express';

import roomRoutes from './roomRoutes';
import roleRoutes from './roleRoutes';

const router = express.Router();


router.use('/rooms', roomRoutes);
router.use('/roles', roleRoutes);

export default router;