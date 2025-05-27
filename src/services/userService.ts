import UserModel from '../models/userModel';

class UserService {
    private users: any[] = []; 

    public async findUserByEmail(email: string) {
        return await UserModel.findOne({ email });
    }

    public async registerUser(userData: any) {
        const newUser = new UserModel(userData);
        await newUser.save();
       
        const token = 'generated-token'; 
        return { ...newUser.toObject(), token };
    }

    loginUser(username: string, password: string) {
      
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return user;
    }

    getUser(userId: number) {
 
        const user = this.users.find(u => u.userId === userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    updateUser(userId: number, updatedData: { username?: string; password?: string; email?: string }) {
        
        const userIndex = this.users.findIndex(u => u.userId === userId);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
        return this.users[userIndex];
    }
}

export default UserService;