import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
    private bookingService: BookingService;
    constructor() {
        this.bookingService = new BookingService();
    }    async createBooking(req: AuthRequest, res: Response): Promise<void> {
        try {
            const bookingData = {
                ...req.body,
                userId: req.user?._id.toString() // Ensure we use the authenticated user's ID
            };
            console.log('Creating booking with data:', bookingData);
            const booking = await this.bookingService.createBooking(bookingData);
            res.status(201).json(booking);
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getBooking(req: AuthRequest, res: Response): Promise<void> {
        // Only allow admin
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const booking = await this.bookingService.getBooking(req.params.id);
            if (!booking) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json(booking);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async updateBooking(req: AuthRequest, res: Response): Promise<void> {
        // Only allow admin
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const booking = await this.bookingService.updateBooking(req.params.id, req.body);
            if (!booking) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json(booking);
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
        // Only allow admin
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const deleted = await this.bookingService.deleteBooking(req.params.id);
            if (!deleted) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json({ message: 'Booking deleted' });
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }    async getAllBookings(req: AuthRequest, res: Response): Promise<void> {
        // Only allow admin
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }

        try {
            const bookings = await this.bookingService.getAllBookings();
            res.json({
                status: 'success',
                data: bookings,
                message: 'All bookings retrieved successfully'
            });
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getBookingsByUserId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const bookings = await this.bookingService.getBookingsByUserId(req.params.userId);
            if (!bookings || bookings.length === 0) {
                res.status(404).json({ error: 'No bookings found for this user' });
                return;
            }
            res.json(bookings);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }    async getBookingsByUserToken(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            
            console.log('User object:', req.user);
            console.log('User ID type:', typeof req.user._id);
            console.log('User ID:', req.user._id);
            
            const Booking = (await import('../models/bookingModel')).default;
            const Room = (await import('../models/Room')).default;
            const User = (await import('../models/User')).default;
            
            // Try both string and ObjectId versions of the ID
            const bookings = await Booking.find({ 
                $or: [
                    { userId: req.user._id },
                    { userId: req.user._id.toString() }
                ] 
            });
            
            console.log('Query result:', bookings);
            if (!bookings || bookings.length === 0) {
                res.status(404).json({ error: 'No bookings found for this user' });
                return;
            }
            // Populate room and user details for each booking
            const detailedBookings = await Promise.all(bookings.map(async (booking: any) => {
                const room = await Room.findById(booking.roomId);
                const user = await User.findById(booking.userId);
                return {
                    booking,
                    room,
                    user
                };
            }));
            res.json(detailedBookings);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
}