import mongoose, { Document, Schema } from 'mongoose';

interface Seating {
  theatre: number;
  ushaped: number;
  boardroom: number;
  classroom: number;
  reception: number;
}

interface HallImage {
  name: string;
  url: string;
  ext: string;
}

export interface HallDocument extends Document {
  hall_name: string;
  max_capacity: number;
  short_intro: string;
  desc?: string;
  length: number;
  breadth: number;
  height: number;
  area: number;
  guest_entry_point?: string;
  phone?: string;
  email?: string;
  seating: Seating;
  hall_image: HallImage[];
  status: 'available' | 'unavailable' | 'maintenance';
  cdate: Date;
}

const seatingSchema = new Schema<Seating>({
  theatre: Number,
  ushaped: Number,
  boardroom: Number,
  classroom: Number,
  reception: Number,
});

const hallImageSchema = new Schema<HallImage>({
  name: String,
  url: String,
  ext: String,
});

const hallSchema = new Schema<HallDocument>({
  hall_name: { type: String, required: true, trim: true },
  max_capacity: { type: Number, required: true },
  short_intro: { type: String, required: true, trim: true },
  desc: { type: String, trim: true },
  length: { type: Number, required: true },
  breadth: { type: Number, required: true },
  height: { type: Number, required: true },
  area: { type: Number, required: true },
  guest_entry_point: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  seating: seatingSchema,
  hall_image: [hallImageSchema],
  status: {
    type: String,
    enum: ['available', 'unavailable', 'maintenance'],
    default: 'available',
  },
  cdate: {
    type: Date,
    default: Date.now,
  },
});

const Hall = mongoose.models.Hall || mongoose.model<HallDocument>('Hall', hallSchema);
export default Hall;