import express from 'express';
import { registerUserController, loginUserController } from '../controllers/userController';
import { auth, roleAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);


router.post('/admin', auth, roleAuth(['admin']), async (req, res, next) => {
  try {
    const userService = new (await import('../services/userService')).default();
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});


// router.put('/admin/:id', auth, roleAuth(['admin']), async (req, res, next) => {
//   try {
//     const userService = new (await import('../services/userService')).default();
//     const updatedUser = await userService.updateUser(req.params.id, req.body);
//     res.json(updatedUser);
//   } catch (err) {
//     next(err);
//   }
// });


router.get('/members', auth, roleAuth(['admin']), async (req, res, next) => {
  try {
    const User = (await import('../models/User')).default;
    const members = await User.find({ role: 'user' });
    if (!members || members.length === 0) {
      res.status(404).json({ error: 'No members found' });
      return;
    }
    res.json(members);
  } catch (err) {
    next(err);
  }
});

export default router;