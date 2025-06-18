import Hall, { HallDocument } from '../models/Hall';

interface HallInput {
  hall_name?: string;
  max_capacity?: number;
  short_intro?: string;
  desc?: string;
  length?: number;
  breadth?: number;
  height?: number;
  area?: number;
  guest_entry_point?: string;
  phone?: string;
  email?: string;
  seating?: {
    theatre: number;
    ushaped: number;
    boardroom: number;
    classroom: number;
    reception: number;
  };
  hall_image?: {
    url: string;
    name: string;
    ext: string;
  }[];
  additionalDetails?: string[];
  status?: 'available' | 'unavailable' | 'maintenance';
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
      return await Hall.find().sort({ cdate: -1 });
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