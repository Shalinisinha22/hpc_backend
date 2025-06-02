import { Router } from 'express';
import { createOffer, getAllOffers } from '../controllers/offerController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();

router.post('/', auth,roleAuth(['admin']), createOffer);
router.get('/',auth, getAllOffers);

export default router;
