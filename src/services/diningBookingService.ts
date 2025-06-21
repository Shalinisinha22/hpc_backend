import DiningBooking, { DiningBookingDocument } from '../models/DiningBooking';

interface DiningBookingInput {
  name: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
}

export class DiningBookingService {
  async createBooking(data: DiningBookingInput): Promise<DiningBookingDocument> {
    const booking = new DiningBooking(data);
    return await booking.save();
  }

  async getAllBookings(): Promise<DiningBookingDocument[]> {
    return DiningBooking.find().populate('dining', 'name').sort({ cdate: -1 });
  }

  async getBookingById(id: string): Promise<DiningBookingDocument | null> {
    return DiningBooking.findById(id).populate('dining', 'name');
  }

  async deleteBooking(id: string): Promise<DiningBookingDocument | null> {
    return DiningBooking.findByIdAndDelete(id);
  }
}

export default DiningBookingService;
