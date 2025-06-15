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
router.post('/', auth, roleAuth(['admin']), promoCodeController.createPromoCode);
router.put('/:id', auth, roleAuth(['admin']), promoCodeController.updatePromoCode);
router.delete('/:id', auth, roleAuth(['admin']), promoCodeController.deletePromoCode);

export default router;