import { Request, Response } from 'express';
import UserService from '../services/userService';

const userService = new UserService();

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};