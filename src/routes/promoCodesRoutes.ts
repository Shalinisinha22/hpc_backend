import express from 'express';
import { PromoCodeController } from '../controllers/promoCodeController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const promoCodeController = new PromoCodeController();

// Public routes
router.post('/validate', promoCodeController.validatePromoCode);

// Protected routes (authentication required)
router.get('/', auth, promoCodeController.getPromoCodes);
router.get('/:id', auth, promoCodeController.getPromoCodeById);

// Admin routes (admin only)
router.post('/', auth, promoCodeController.createPromoCode);
router.put('/:id', auth, promoCodeController.updatePromoCode);
router.delete('/:id', auth, promoCodeController.deletePromoCode);

export default router;