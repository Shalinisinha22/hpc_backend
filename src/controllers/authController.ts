import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';
import { AuthService } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
      res.status(201).json({ message: 'Registered successfully', user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      const { password: pwd, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
      res.json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}