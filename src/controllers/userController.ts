import { Request, Response } from 'express';
import UserService from '../services/userService';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, ...userData } = req.body;

            // Check if the email already exists
            const existingUser = await this.userService.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Register the new user
            const newUser = await this.userService.registerUser({ email, ...userData });

            // Assuming the userService returns a token upon successful registration
            const { name, token } = newUser;

            res.status(201).json({ name, email, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    public loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            const user = await this.userService.loginUser(username, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };

    public getUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUser(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const updatedData = req.body;
            const updatedUser = await this.userService.updateUser(userId, updatedData);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}

export default UserController;