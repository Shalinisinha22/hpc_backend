import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'e788376cbfe773b65ae93982a863903d367286587aea524c4c14f53578a919d0e2e6a4f16b0d8c6e1a1672e881460e288c8fe649ea70b912baa89782873b055d51fd1d75bac8a52e496a6e1b2ed850c62e6d38b1a045a3272c9559afa0728f54';

export class AuthService {
  async register(userData: any) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User(userData);
    await user.save();
    return user;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
  }
}