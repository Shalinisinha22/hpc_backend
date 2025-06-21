import mongoose, { Document, Schema } from 'mongoose';

export interface DiningBookingDocument extends Document {
  name: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  dining: Schema.Types.ObjectId;
  cdate: Date;
}

const diningBookingSchema = new Schema<DiningBookingDocument>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true },
  guests: { type: Number, required: true },
  dining: { type: Schema.Types.ObjectId, ref: 'Dining', required: true },
  cdate: { type: Date, default: Date.now }
});

const DiningBooking = mongoose.models.DiningBooking || mongoose.model<DiningBookingDocument>('DiningBooking', diningBookingSchema);
export default DiningBooking;
