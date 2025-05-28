import mongoose, { Schema, Document } from 'mongoose';

export interface Booking extends Document {
    bookingId: string;
    userId: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    adults: number;
    children: number;
    fullName: string;
    email: string;
    phone: string;
    specialRequest?: string;
    saveMyInfo: boolean;
    paymentStatus: 'confirmed' | 'canceled' | 'completed';
    createdAt: Date; // Added by timestamps
    updatedAt: Date; // Added by timestamps
}

const BookingSchema: Schema = new Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequest: { type: String },
    saveMyInfo: { type: Boolean, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['confirmed', 'canceled', 'completed'], 
        required: true 
    }
}, {
    timestamps: true, // This will add createdAt and updatedAt fields
});

export default mongoose.model<Booking>('Booking', BookingSchema);

