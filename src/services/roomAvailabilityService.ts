import Room from '../models/Room';
import RoomUnavailability from '../models/RoomUnavailability';
import mongoose, { Document } from 'mongoose';

export interface IRoomUnavailability extends Document {
  roomId: string;
  fromDate: Date;
  toDate: Date;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UnavailabilityInput {
  roomId: string;
  fromDate: Date;
  toDate: Date;
  reason?: string;
}

export class RoomAvailabilityService {
  async setRoomUnavailability(data: UnavailabilityInput): Promise<IRoomUnavailability> {
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

      // Check for overlapping unavailability periods
      const overlapping = await RoomUnavailability.findOne({
        roomId: data.roomId,
        $or: [
          {
            fromDate: { $lte: data.toDate },
            toDate: { $gte: data.fromDate }
          }
        ]
      });

      if (overlapping) {
        throw new Error('Room unavailability period overlaps with existing period');
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
    } catch (error: any) {
      await session.abortTransaction();
      throw new Error(error.message || 'Failed to set room unavailability');
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
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch available rooms');
    }
  }

  async getAvailableRoomsForDates(checkIn: Date, checkOut: Date) {
    try {
      // Find rooms that are not unavailable during the requested period
      const unavailableRoomIds = await RoomUnavailability.find({
        $or: [
          {
            fromDate: { $lte: checkOut },
            toDate: { $gte: checkIn }
          }
        ]
      }).distinct('roomId');

      const availableRooms = await Room.find({
        _id: { $nin: unavailableRoomIds },
        status: 'available'
      })
      .select('-__v')
      .sort({ cdate: -1 });

      return availableRooms;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch available rooms for dates');
    }
  }

  async getAllUnavailabilities(): Promise<IRoomUnavailability[]> {
    try {
      return await RoomUnavailability.find()
        .populate('roomId', 'room_title')
        .sort({ fromDate: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch room unavailabilities');
    }
  }

  async getUnavailabilityById(id: string): Promise<IRoomUnavailability | null> {
    try {
      const unavailability = await RoomUnavailability.findById(id)
        .populate('roomId', 'room_title');
      return unavailability;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch room unavailability');
    }
  }

  async updateUnavailability(id: string, data: Partial<UnavailabilityInput>): Promise<IRoomUnavailability | null> {
    try {
      const unavailability = await RoomUnavailability.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      ).populate('roomId', 'room_title');
      return unavailability;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update room unavailability');
    }
  }

  async deleteUnavailability(id: string): Promise<IRoomUnavailability | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const unavailability = await RoomUnavailability.findById(id);
      if (!unavailability) {
        return null;
      }

      // Check if this is the only unavailability for this room
      const otherUnavailabilities = await RoomUnavailability.find({
        roomId: unavailability.roomId,
        _id: { $ne: id }
      });

      // If no other unavailabilities, make room available
      if (otherUnavailabilities.length === 0) {
        await Room.findByIdAndUpdate(
          unavailability.roomId,
          { status: 'available' },
          { session }
        );
      }

      const deleted = await RoomUnavailability.findByIdAndDelete(id, { session });
      await session.commitTransaction();
      return deleted;
    } catch (error: any) {
      await session.abortTransaction();
      throw new Error(error.message || 'Failed to delete room unavailability');
    } finally {
      session.endSession();
    }
  }

  async updateRoomStatuses(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find ended unavailabilities
      const endedUnavailabilities = await RoomUnavailability.find({
        toDate: { $lt: today }
      });

      // Update room statuses for ended unavailabilities
      for (const unavailability of endedUnavailabilities) {
        // Check if room has other active unavailabilities
        const activeUnavailabilities = await RoomUnavailability.find({
          roomId: unavailability.roomId,
          toDate: { $gte: today },
          _id: { $ne: unavailability._id }
        });

        // If no other active unavailabilities, make room available
        if (activeUnavailabilities.length === 0) {
          await Room.findByIdAndUpdate(
            unavailability.roomId,
            { status: 'available' }
          );
        }
      }

      // Delete ended unavailabilities
      await RoomUnavailability.deleteMany({
        toDate: { $lt: today }
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update room statuses');
    }
  }
}