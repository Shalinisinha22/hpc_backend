import { Router } from 'express';
import { createOffer, deleteOffer, getAllOffers, updateOffer } from '../controllers/offerController';
import { auth, roleAuth } from '../middleware/auth';

const router = Router();

router.post('/', auth,roleAuth(['admin']), createOffer);
router.get('/',auth, getAllOffers);
router.put('/:id', auth, roleAuth(['admin']), updateOffer )
router.delete('/:id', auth, roleAuth(['admin']), deleteOffer);
export default router;
