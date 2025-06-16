import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('No token provided')
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
          expiredAt: err.expiredAt
        })
        return
      }
      throw new Error('Invalid token')
    }

    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      throw new Error('Invalid token payload')
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      throw new Error('User not found')
    }

    req.user = user
    next()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('JWT auth error:', message)
    res.status(401).json({ 
      error: 'Authentication failed', 
      message,
      code: 'AUTH_FAILED'
    })
  }
}

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

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('OptionalAuth middleware called');
    console.log('Authorization header:', req.header('Authorization'));
    console.log('Token in body:', req.body.token);
    
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token;
    
    console.log('Extracted token:', token ? 'Token found' : 'No token');
    
    if (!token) {
      console.log('No token provided, continuing without authentication');
      next();
      return;
    }

    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      next();
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      // Continue without authentication if token is invalid
      next();
      return;
    }

    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      console.error('Invalid token payload');
      next();
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('User not found for token');
      next();
      return;
    }

    console.log('User found and authenticated:', user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication on any error
    next();
  }
};