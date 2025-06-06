import Room from '../models/Room';
import RoomUnavailability from '../models/RoomUnavailability';
import mongoose from 'mongoose';

export class RoomAvailabilityService {
  async setRoomUnavailability(data: {
    roomId: string;
    fromDate: Date;
    toDate: Date;
    reason?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (new Date(data.fromDate) >= new Date(data.toDate)) {
        throw new Error('End date must be after start date');
      }

      const room = await Room.findById(data.roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Update room status to unavailable
      await Room.findByIdAndUpdate(
        data.roomId,
        { status: 'unavailable' },
        { session }
      );

      const unavailability = new RoomUnavailability(data);
      await unavailability.save({ session });

      await session.commitTransaction();
      return unavailability;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAvailableRooms() {
    try {
      const rooms = await Room.find({ status: 'available' })
        .select('-__v')
        .sort({ cdate: -1 });
      return rooms;
    } catch (error) {
      throw error;
    }
  }

 
  async updateRoomStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

 
    const endedUnavailabilities = await RoomUnavailability.find({
      toDate: { $lt: today }
    });


    for (const unavailability of endedUnavailabilities) {
      await Room.findByIdAndUpdate(
        unavailability.roomId,
        { status: 'available' }
      );
    }

    
    await RoomUnavailability.deleteMany({
      toDate: { $lt: today }
    });
  }
}