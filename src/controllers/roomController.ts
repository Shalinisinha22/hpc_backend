import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';

export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  createRoom = async (req: Request, res: Response) => {
    try {
      const room = await this.roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getRooms = async (_req: Request, res: Response) => {
    try {
      const rooms = await this.roomService.getRooms();
      res.json(rooms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getRoomById = async (req: Request, res: Response) => {
    try {
      const room = await this.roomService.getRoomById(req.params.id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateRoom = async (req: Request, res: Response) => {
    try {
      const room = await this.roomService.updateRoom(req.params.id, req.body);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteRoom = async (req: Request, res: Response) => {
    try {
      await this.roomService.deleteRoom(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}