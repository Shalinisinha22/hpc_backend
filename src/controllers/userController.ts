import { Request, Response } from 'express';
import UserService from '../services/userService';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Received user registration data:', req.body);
    try {
      // Validate required fields
      const { name, email, phone, password } = req.body;
      if (!name || !email || !password || !phone) {
        res.status(400).json({ 
          error: 'Missing required fields: name, email, phone, and password are required',
          success: false 
        });
        return;
      }

      const result = await this.userService.registerUser(req.body);
      res.status(201).json({
        ...result,
        success: true
      });
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to register user',
        success: false 
      });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Received user login data:', req.body);
    try {
      // Validate required fields
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ 
          error: 'Missing required fields: email and password are required',
          success: false 
        });
        return;
      }

      const result = await this.userService.loginUser(email, password);
      res.status(200).json({
        result,
        success: true
      });
    } catch (error: any) {
      console.error('Error logging in user:', error);
      res.status(401).json({ 
        error: error.message || 'Failed to login',
        success: false 
      });
    }
  };

  getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({
        user,
        message: "User updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.updateUser(userId, req.body);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({
        user,
        message: "Profile updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.userService.deleteUser(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ 
          error: 'Current password and new password are required',
          success: false 
        });
        return;
      }

      await this.userService.changePassword(userId, currentPassword, newPassword);
      res.json({
        message: 'Password changed successfully',
        success: true
      });
      return;
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || 'Failed to change password',
        success: false 
      });
      return;
    }
  };

  verifyPhoneOtp = async (req: Request, res: Response): Promise<void> => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ error: 'Phone and OTP are required', success: false });
      return;
    }
    try {
      // Replace with your actual Otpless API call and credentials
      const axios = require('axios');
      const verifyRes = await axios.post('https://api.otpless.com/otp/verify', {
        phone,
        otp,
        // ...other required params, e.g., your API key/secret
      }, {
        headers: {
          'Authorization': 'Bearer YOUR_OTPLESS_API_KEY'
        }
      });
      if (!verifyRes.data.success) {
        res.status(400).json({ error: 'Invalid OTP', success: false });
        return;
      }
      res.json({ message: 'Phone number verified successfully', success: true });
      return;
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'OTP verification failed', success: false });
      return;
    }
  };
}