import { Response } from 'express';
import { RoomAvailabilityService } from '../services/roomAvailabilityService';
import { AuthRequest } from '../middleware/auth';

export class RoomAvailabilityController {
  private roomAvailabilityService: RoomAvailabilityService;

  constructor() {
    this.roomAvailabilityService = new RoomAvailabilityService();
  }

  getAvailableRooms = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('Fetching available rooms...');
      const { checkIn, checkOut } = req.query;
      
      let rooms;
      if (checkIn && checkOut) {
        rooms = await this.roomAvailabilityService.getAvailableRoomsForDates(
          new Date(checkIn as string),
          new Date(checkOut as string)
        );
      } else {
        rooms = await this.roomAvailabilityService.getAvailableRooms();
      }

      // console.log('Available rooms:', rooms);
      
      if (!rooms || rooms.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No available rooms found',
          data: []
        });
        return;
      }

      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms,
        timestamp: new Date()
      });
    } catch (error: any) {
      console.error('Error fetching available rooms:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch available rooms',
        success: false 
      });
    }
  };

  setRoomUnavailability = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Setting room unavailability:', req.body);
    try {
      // Validate required fields
      const { roomId, fromDate, toDate } = req.body;
      if (!roomId || !fromDate || !toDate) {
        res.status(400).json({ 
          error: 'Missing required fields: roomId, fromDate, and toDate are required',
          success: false 
        });
        return;
      }

      // Validate date range
      if (new Date(fromDate) >= new Date(toDate)) {
        res.status(400).json({ 
          error: 'End date must be after start date',
          success: false 
        });
        return;
      }

      const result = await this.roomAvailabilityService.setRoomUnavailability(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Room unavailability set successfully'
      });
    } catch (error: any) {
      console.error('Error setting room unavailability:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to set room unavailability',
        success: false 
      });
    }
  };

  getRoomUnavailabilities = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const unavailabilities = await this.roomAvailabilityService.getAllUnavailabilities();
      res.json({
        success: true,
        data: unavailabilities
      });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getRoomUnavailabilityById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const unavailability = await this.roomAvailabilityService.getUnavailabilityById(req.params.id);
      if (!unavailability) {
        res.status(404).json({ error: 'Room unavailability not found' });
        return;
      }
      res.json({
        success: true,
        data: unavailability
      });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateRoomUnavailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const unavailability = await this.roomAvailabilityService.updateUnavailability(req.params.id, req.body);
      if (!unavailability) {
        res.status(404).json({ error: 'Room unavailability not found' });
        return;
      }
      res.json({
        success: true,
        data: unavailability,
        message: "Room unavailability updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deleteRoomUnavailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.roomAvailabilityService.deleteUnavailability(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Room unavailability not found' });
        return;
      }
      res.json({ 
        success: true,
        message: 'Room unavailability deleted successfully' 
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  updateRoomStatuses = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.roomAvailabilityService.updateRoomStatuses();
      res.json({
        success: true,
        message: 'Room statuses updated successfully'
      });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };
}