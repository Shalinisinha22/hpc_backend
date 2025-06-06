import { EventBooking } from '../models';

export class EventBookingService {
  async createEventBooking(bookingData: any) {
    const eventBooking = new EventBooking(bookingData);
    await eventBooking.save();
    return eventBooking;
  }

  async getEventBookings() {
    return EventBooking.find().populate('hallId', 'hall_name capacity location').sort({ cdate: -1 });
  }

  async getEventBookingById(id: string) {
    return EventBooking.findById(id).populate('hallId', 'hall_name capacity location');
  }

  async updateEventBooking(id: string, bookingData: any) {
    return EventBooking.findByIdAndUpdate(id, bookingData, { new: true }).populate('hallId', 'hall_name capacity location');
  }

  async deleteEventBooking(id: string) {
    return EventBooking.findByIdAndDelete(id);
  }

  async getEventBookingsByStatus(status: string) {
    return EventBooking.find({ status }).populate('hallId', 'hall_name capacity location').sort({ cdate: -1 });
  }

  async getEventBookingsByDateRange(startDate: Date, endDate: Date) {
    return EventBooking.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('hallId', 'hall_name capacity location').sort({ date: 1 });
  }
}