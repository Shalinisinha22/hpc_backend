import mongoose, { Document, Schema } from 'mongoose';

interface DiningImage {
  url: string;
  name: string;
  ext: string;
}



export interface DiningDocument extends Document {
  name: string;
  shortIntro: string;
  description?: string;
  breakfastTiming?: string,
  lunchDinnerTiming?: string,
  avgPriceFor2: number;
  phone?: string;
  location: string;
  image: DiningImage[];
  cdate: Date;
}

const diningImageSchema = new Schema<DiningImage>({
  url: { type: String, required: true },
  name: { type: String, required: true },
  ext: { type: String, required: true }
});



const diningSchema = new Schema<DiningDocument>({
  name: { type: String, required: true, trim: true },
  shortIntro: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
   breakfastTiming  : { type: String, required: false, trim: true }, 
    lunchDinnerTiming: { type: String, required: false, trim: true },
  avgPriceFor2: { type: Number, required: true },
  phone: { type: String, trim: true },
  location: { type: String, required: false, trim: true },
  image:[diningImageSchema],
  cdate: { type: Date, default: Date.now }
});

const Dining = mongoose.models.Dining || mongoose.model<DiningDocument>('Dining', diningSchema);
export default Dining;
