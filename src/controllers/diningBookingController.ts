import { Response } from 'express';
import DiningBookingService from '../services/diningBookingService';
import { AuthRequest } from '../middleware/auth';

export class DiningBookingController {
  private diningBookingService: DiningBookingService;

  constructor() {
    this.diningBookingService = new DiningBookingService();
  }

  createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await this.diningBookingService.createBooking(req.body);
      res.status(201).json({ booking, message: 'Booking created successfully', success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create booking', success: false });
    }
  };

  getAllBookings = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const bookings = await this.diningBookingService.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await this.diningBookingService.getBookingById(req.params.id);
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.diningBookingService.deleteBooking(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
