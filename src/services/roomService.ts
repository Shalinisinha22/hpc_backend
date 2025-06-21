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

  async addRoomImage(roomId: string, img: { url: string; name: string; ext: string }) {
    // Find the room
    const room = await Room.findById(roomId);
    if (!room) return null;

    // Add new image object to the array
    room.roomImage.push(img);
    await room.save();
    return room;
  }

  async deleteRoomImage(roomId: string, imgId: string) {
    // Find the room
    const room = await Room.findById(roomId);
    if (!room) return null;   
    // Filter out the image with the specified ID
    room.roomImage = room.roomImage.filter((img) => img._id.toString() !== imgId);
    await room.save();
    return room;  
  }
}