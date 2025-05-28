import { Response } from 'express';
import { RoomService } from '../services/roomService';
import { AuthRequest } from '../middleware/auth';

// Ensure all methods return void and do not return res.status().json(...)
export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const room = await this.roomService.createRoom(req.body);
      res.status(201).json(room);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
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
      res.json(room);
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