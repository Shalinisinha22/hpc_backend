import express from 'express';
import { registerUserController, loginUserController } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

const setUserRoutes = (app) => {
    app.use('/api/users', router);
    
    router.post('/register', registerUserController);
    router.post('/login', loginUserController);
    

    router.get('/profile', authenticate, (req, res) => {
        res.json({ message: 'This is a protected route', user: (req as any).user });
    });
};

export default setUserRoutes;