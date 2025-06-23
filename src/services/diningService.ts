import Dining, { DiningDocument } from '../models/Dining';

interface DiningInput {
  name: string;
  shortIntro: string;
  description?: string;
  timing: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  avgPriceFor2: number;
  phone?: string;
  location: string;
  image: { url: string; name: string; ext: string }[];
}

export class DiningService {
  async createDining(data: DiningInput): Promise<DiningDocument> {
    const dining = new Dining(data);
    return await dining.save();
  }

  async getAllDining(): Promise<DiningDocument[]> {
    return Dining.find().sort({ cdate: -1 });
  }

  async getDiningById(id: string): Promise<DiningDocument | null> {
    return Dining.findById(id);
  }

  async updateDining(id: string, data: Partial<DiningInput>): Promise<DiningDocument | null> {
    return Dining.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteDining(id: string): Promise<DiningDocument | null> {
    return Dining.findByIdAndDelete(id);
  }

  async addDiningImage(diningId: string, img: { url: string; name: string; ext: string }) {
    const dining = await Dining.findById(diningId);
    if (!dining) return null;
    dining.image.push(img);
    await dining.save();
    return dining;
  }

  async addDiningImages(diningId: string, images: { url: string; name: string; ext: string }[]) {
    const dining = await Dining.findById(diningId);
    if (!dining) return null;
    dining.image.push(...images);
    await dining.save();
    return dining;
  }

  async deleteDiningImage(diningId: string, imageId: string) {
    const dining = await Dining.findById(diningId);
    if (!dining) return null;
    dining.image = dining.image.filter((img: any) => img._id?.toString() !== imageId && img.name !== imageId);
    await dining.save();
    return dining;
  }

  async getDiningImages(): Promise<DiningDocument[]> {
    return Dining.find({}, { image: 1, _id: 0,name:1  }).populate('image');
  }
}

export default DiningService;
