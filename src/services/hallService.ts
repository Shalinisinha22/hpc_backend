import Hall, { HallDocument } from '../models/Hall';

interface HallInput {
  hall_name?: string;
  location?: string;
  capacity?: number;
  price?: number;
  description?: string;
  amenities?: string[];
  hallImage?: {
    url: string;
    name: string;
    ext: string;
  }[];
  available?: boolean;
  featured?: boolean;
}

export class HallService {
  async createHall(data: HallInput): Promise<HallDocument> {
    try {
      const hall = new Hall(data);
      return await hall.save();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create hall');
    }
  }

  async getAllHalls(): Promise<HallDocument[]> {
    try {
      return await Hall.find().sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch halls');
    }
  }

  async getHallById(id: string): Promise<HallDocument | null> {
    try {
      const hall = await Hall.findById(id);
      return hall;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch hall');
    }
  }

  async updateHall(id: string, data: Partial<HallInput>): Promise<HallDocument | null> {
    try {
      const hall = await Hall.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      );
      return hall;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update hall');
    }
  }

  async deleteHall(id: string): Promise<HallDocument | null> {
    try {
      const hall = await Hall.findByIdAndDelete(id);
      return hall;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete hall');
    }
  }
}

export default HallService;