import { Response } from 'express';
import { EventBookingService } from '../services/eventBookingService';
import { AuthRequest } from '../middleware/auth';

export class EventBookingController {
  private eventBookingService: EventBookingService;

  constructor() {
    this.eventBookingService = new EventBookingService();
  }

  createEventBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eventBooking = await this.eventBookingService.createEventBooking(req.body);
      res.status(201).json({ 
        success: true, 
        data: eventBooking, 
        message: 'Event booking created successfully' 
      });
      return;
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  getEventBookings = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eventBookings = await this.eventBookingService.getEventBookings();
      res.status(200).json({ 
        success: true, 
        data: eventBookings 
      });
      return;
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  getEventBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eventBooking = await this.eventBookingService.getEventBookingById(req.params.id);
      if (!eventBooking) {
        res.status(404).json({ 
          success: false, 
          error: 'Event booking not found' 
        });
        return;
      }
      res.status(200).json({ 
        success: true, 
        data: eventBooking 
      });
      return;
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  updateEventBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const eventBooking = await this.eventBookingService.updateEventBooking(req.params.id, req.body);
      if (!eventBooking) {
        res.status(404).json({ 
          success: false, 
          error: 'Event booking not found' 
        });
        return;
      }
      res.status(200).json({ 
        success: true, 
        data: eventBooking, 
        message: 'Event booking updated successfully' 
      });
      return;
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  deleteEventBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const deleted = await this.eventBookingService.deleteEventBooking(req.params.id);
      if (!deleted) {
        res.status(404).json({ 
          success: false, 
          error: 'Event booking not found' 
        });
        return;
      }
      res.status(200).json({ 
        success: true, 
        message: 'Event booking deleted successfully' 
      });
      return;
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  getEventBookingsByStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const { status } = req.params;
      const eventBookings = await this.eventBookingService.getEventBookingsByStatus(status);
      res.status(200).json({ 
        success: true, 
        data: eventBookings 
      });
      return;
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };

  getEventBookingsByDateRange = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ 
          success: false, 
          error: 'Start date and end date are required' 
        });
        return;
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      const eventBookings = await this.eventBookingService.getEventBookingsByDateRange(start, end);
      res.status(200).json({ 
        success: true, 
        data: eventBookings 
      });
      return;
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }
  };
}