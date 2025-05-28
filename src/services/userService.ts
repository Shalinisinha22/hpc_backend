import User from '../models/User';
import jwt from 'jsonwebtoken';

class UserService {
    public async findUserByEmail(email: string) {
        return await User.findOne({ email });
    }

    public async registerUser(userData: any) {
        const newUser = new User(userData);
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        return { ...newUser.toObject(), token };
    }

    public async loginUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        return { ...user.toObject(), token };
    }

    public async getUser(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    public async updateUser(userId: string, updatedData: { name?: string; password?: string; email?: string }) {
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export default UserService;