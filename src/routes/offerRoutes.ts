import express from 'express';
import { OfferController } from '../controllers/offerController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const offerController = new OfferController();

// Public routes
router.get('/', offerController.getOffers);
router.get('/:id', offerController.getOfferById);

// Protected routes (admin only)
router.post('/', auth, roleAuth(['admin']), offerController.createOffer);
router.put('/:id', auth, roleAuth(['admin']), offerController.updateOffer);
router.delete('/:id', auth, roleAuth(['admin']), offerController.deleteOffer);

export default router;