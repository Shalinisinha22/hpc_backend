import { Request } from 'express';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
    _id: string;
    email: string;
    name: string;
    [key: string]: any;
}

export interface AuthRequest extends Request {
    user?: UserDocument;
}
