import mongoose, { Schema, Document } from 'mongoose';

export interface Booking extends Document {
    bookingId: string;
    userId: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    noOfGuests:{
        adults: number;
        children: number;
    }
    noOfRooms: number;
    fullName: string;
    email: string;
    phone: string;
    specialRequest?: string;
      totalPrice?: number;
    paymentStatus: 'confirmed' | 'canceled' | 'completed' | 'pending';

    createdAt: Date; 
    updatedAt: Date; 
}

const BookingSchema: Schema = new Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: false },
    roomId: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    noOfGuests: {
        adults: { type: Number, required: false, default: 1 },
        children: { type: Number, required: false, default: 0 }
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequest: { type: String },
    totalPrice: { type: Number, default: 0 },
    noOfRooms: { type: Number, required: true, default: 1 },
    paymentStatus: { 
        type: String, 
        enum: ['confirmed', 'canceled', 'completed','pending'], 
        required: true 
    }
}, {
    timestamps: true, 
});

export default mongoose.model<Booking>('Booking', BookingSchema);

