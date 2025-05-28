import { Router } from 'express';
import { createPromoCode } from '../controllers/promoCodeController';
import { roleAuth } from '../middleware/auth';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/', auth, roleAuth(['admin']), createPromoCode);

export default router;
