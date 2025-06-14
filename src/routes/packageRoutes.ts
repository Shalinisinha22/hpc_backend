import express from 'express';
import { PackageController } from '../controllers/packageController';
import { auth } from '../middleware/auth';

const router = express.Router();
const packageController = new PackageController();

router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', auth, packageController.createPackage);
router.put('/:id', auth, packageController.updatePackage);
router.delete('/:id', auth, packageController.deletePackage);

export default router;