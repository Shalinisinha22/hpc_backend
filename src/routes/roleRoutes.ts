import { Router } from 'express';
import * as roleController from '../controllers/roleController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, roleController.createRole);
router.get('/',auth, roleController.getRoles);
router.get('/:id',auth, roleController.getRoleById);
router.put('/:id', auth,roleController.updateRole);
router.delete('/:id',auth, roleController.deleteRole);

export default router;
