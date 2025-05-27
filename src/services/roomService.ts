import { Room } from '../models';

export class RoomService {
  async createRoom(roomData: any) {
    const room = new Room(roomData);
    await room.save();
    return room;
  }

  async getRooms() {
    return Room.find();
  }

  async getRoomById(id: string) {
    return Room.findById(id);
  }

  async updateRoom(id: string, roomData: any) {
    return Room.findByIdAndUpdate(id, roomData, { new: true });
  }

  async deleteRoom(id: string) {
    return Room.findByIdAndDelete(id);
  }
}