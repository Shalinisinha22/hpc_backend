import { Router } from 'express';
import { createPromoCode, deletePromoCode, getAllPromoCodes } from '../controllers/promoCodeController';
import { roleAuth } from '../middleware/auth';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/', auth, roleAuth(['admin']), createPromoCode);
router.get('/', auth, getAllPromoCodes ),
router.delete("/:id", auth, roleAuth(['admin']), deletePromoCode)

export default router;
