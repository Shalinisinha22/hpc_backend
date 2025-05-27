import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AuthService } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.json({ user, token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}