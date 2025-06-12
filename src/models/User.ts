import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone:number;
  role: string;
  status: string;
  cdate: Date;
  bookingIds: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone:{
    type: Number,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'Front Office', 'HR', 'Bqt Service', 'Account'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  cdate: {
    type: Date,
    default: Date.now
  },
  bookingIds: [{ type: String }]
});


userSchema.pre<UserDocument>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;