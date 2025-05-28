import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      res.status(500).json({ error: 'JWT_SECRET is not defined' });
      return;
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('Invalid token:', err);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      console.error('Invalid token payload:', decoded);
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('User not found for token:', decoded.id);
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('JWT auth error:', message);
    res.status(401).json({ error: 'Please authenticate', details: message });
    return;
  }
};

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Please authenticate' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

export const roleAuth = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Please authenticate' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied: insufficient role' });
      return;
    }
    next();
  };
};