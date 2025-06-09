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
      const rooms = await this.roomService.getRooms();
      res.json(rooms);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
}