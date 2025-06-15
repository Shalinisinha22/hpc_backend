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
            phone: user.phone,
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
            phone: user.phone,
            token,
            message: "Login successful"
        };
    }

    async getUsers() {
        const users = await User.find({}, { password: 0 }); // Exclude password field
        return users;
    }

    async getUserById(id: string) {
        const user = await User.findById(id, { password: 0 }); // Exclude password field
        return user;
    }

    async updateUser(id: string, updateData: any) {
        // Remove password from update data if present (use changePassword method instead)
        const { password, ...safeUpdateData } = updateData;
        
        const user = await User.findByIdAndUpdate(
            id, 
            safeUpdateData, 
            { new: true, select: '-password' }
        );
        return user;
    }

    async deleteUser(id: string) {
        const user = await User.findByIdAndDelete(id);
        return user;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
        return true;
    }

    private generateToken(userId: string): string {
        return jwt.sign(
            { id: userId }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1d' }
        );
    }
}