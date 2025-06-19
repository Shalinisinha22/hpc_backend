import mongoose, { Schema, Document } from "mongoose";

export interface Booking extends Document {
  bookingId: string;
  userId?: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  noOfGuests: {
    adults: number;
    children: number;
  };
  noOfRooms: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequest?: string;
  totalPrice: number;
  paymentStatus: "confirmed" | "canceled" | "completed" | "pending";
  paymentInfo?: {
    method: string;
    transactionId?: string;
    paidAmount: number;
    paidAt: Date;
  };
  isGuest: boolean;

  createdAt: Date;
  updatedAt: Date;
  status?:"confirmed" | "canceled" | "completed" | "pending";
}

const BookingSchema: Schema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    noOfGuests: {
      adults: { type: Number, required: false, default: 1, min: 1 },
      children: { type: Number, required: false, default: 0, min: 0 },
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    specialRequest: { type: String, trim: true },
    totalPrice: { type: Number, default: 0, min: 0 },
    noOfRooms: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    paymentStatus: {
      type: String,
      enum: ["confirmed", "canceled", "completed", "pending"],
      required: true,
      default: "pending",
    },
    paymentInfo: {
      method: String,
      transactionId: String,
      paidAmount: Number,
      paidAt: Date,
    },
    isGuest:{
      type: Boolean,
      default: false,
      required: true,
    },
     status:{
    type: String,
    enum: ["confirmed", "canceled", "completed", "pending"],
    default: "pending",
  },
  },
 
  {
    timestamps: true,
  }
);

// Add index for better query performance
BookingSchema.index({ userId: 1, checkInDate: -1 });
BookingSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.model<Booking>("Booking", BookingSchema);
