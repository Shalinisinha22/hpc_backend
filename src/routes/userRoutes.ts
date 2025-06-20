import express from 'express';
import { UserController } from '../controllers/userController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Public routes (no authentication required)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);



// Protected routes (authentication required)
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);

// Admin routes (authentication required)
router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id',auth, auth, userController.deleteUser);

export default router;