import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default class UserService {
    async registerUser(userData: { name: string; email: string; password: string; role?: string }) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const user = new User({ 
            ...userData,
            role: userData.role || 'user' 
        });
        await user.save();

        const token = this.generateToken(user._id);
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            message: "Registration successful"
        };
    }

    async loginUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user._id);
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            message: "Login successful"
        };
    }

    private generateToken(userId: string): string {
        return jwt.sign(
            { id: userId }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1d' }
        );
    }
}