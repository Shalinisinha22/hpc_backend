import { Router } from 'express';
import { createOffer, getAllOffers } from '../controllers/offerController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();

router.post('/', auth,roleAuth(['admin']), createOffer);
router.get('/', getAllOffers);

export default router;
