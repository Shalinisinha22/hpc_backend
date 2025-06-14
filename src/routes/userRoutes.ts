import express from 'express';
import { UserController } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

export default router;