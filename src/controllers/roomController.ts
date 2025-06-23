import { Response } from 'express';
import { RoomService } from '../services/roomService';
import { AuthRequest } from '../middleware/auth';


export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received room data:', req.body);
    try {
      // Parse and validate the data
      const roomData = {
        ...req.body,
        max_person: parseInt(req.body.max_person),
        max_children: parseInt(req.body.max_children),
        totalRooms: parseInt(req.body.totalRooms),
        roomSize: parseInt(req.body.roomSize),
        roomImage: typeof req.body.roomImage === 'string' 
          ? JSON.parse(req.body.roomImage) 
          : req.body.roomImage
      };

      // Validate required fields
      if (!roomData.room_title || !roomData.roomImage) {
        res.status(400).json({ 
          error: 'Missing required fields',
          success: false 
        });
        return;
      }

      const room = await this.roomService.createRoom(roomData);
      res.status(201).json({
        room, 
        message: 'Room created successfully',
        success: true
      });
    } catch (error: any) {
      console.error('Error creating room:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create room',
        success: false 
      });
    }
  };

  getRooms = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('getRooms called');
      const rooms = await this.roomService.getRooms();
      console.log('Rooms fetched successfully, count:', rooms.length);
      res.json(rooms);
      return;
    } catch (error: any) {
      console.error('Error in getRooms:', error);
      res.status(500).json({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      return;
    }
  };

  getRoomById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const room = await this.roomService.getRoomById(req.params.id);
      if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json(room);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const room = await this.roomService.updateRoom(req.params.id, req.body);
      if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json({room,message:"update successfully"});
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  addRoomImage = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('addRoomImage called with file:', req.body);
    try {
      if (!req.body) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const roomId = req.params.id; 

      const img={
        name:req.body.name,
        url:req.body.url,
        ext: req.body.ext,
      }

 
      const updatedRoom = await this.roomService.addRoomImage(roomId, img);
      if (!updatedRoom) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json({
        room: updatedRoom,
        message: 'Image added successfully',
        success: true
      });
      return;
    } catch (error: any) {
      console.error('Error adding room image:', error);
      res.status(500).json({
        error: error.message || 'Failed to add room image',
        success: false
      });
      return;
    }
  };

  deleteRoomImage = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log(req.params);
    try {
      const roomId = req.params.id;
      const imageId = req.params.imgId;
      if (!imageId) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }
      const updatedRoom = await this.roomService.deleteRoomImage(roomId, imageId);
      if (!updatedRoom) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json({
        room: updatedRoom,
        message: 'Image deleted successfully',
        success: true
      });
      return;
    } catch (error: any) {
      console.error('Error deleting room image:', error);
      res.status(500).json({
        error: error.message || 'Failed to delete room image',
        success: false
      });
      return;
    }
  };

  deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.roomService.deleteRoom(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json({ message: 'Room deleted' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  getAllRoomsImages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rooms = await this.roomService.getRoomsImages();
      if (!rooms || rooms.length === 0) {
        res.status(404).json({ error: 'No rooms found' });
        return;
      }
      const roomImages = rooms.map(room => ({
        id: room._id,
        images: room.roomImage,
        room_name: room.room_title
      }));
      res.json(roomImages);
      return;
    } catch (error: any) {
      console.error('Error fetching room images:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch room images',
        success: false 
      });
      return;
    }
  }
}