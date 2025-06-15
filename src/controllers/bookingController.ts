import { Response } from 'express';
import { BookingService } from '../services/bookingService';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
    private bookingService: BookingService;
    
    constructor() {
        this.bookingService = new BookingService();
        // Bind all methods to maintain 'this' context
        this.createBooking = this.createBooking.bind(this);
        this.getBooking = this.getBooking.bind(this);
        this.updateBooking = this.updateBooking.bind(this);
        this.deleteBooking = this.deleteBooking.bind(this);
        this.getAllBookings = this.getAllBookings.bind(this);
        this.getBookingsByUserId = this.getBookingsByUserId.bind(this);
        this.getBookingsByUserToken = this.getBookingsByUserToken.bind(this);
    }    

    // Convert methods to arrow functions to preserve 'this' context
    createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const bookingData = {
                ...req.body,
                ...((!req.body.isGuest && req.user) && { userId: req.user._id.toString() }),
                noOfGuests: {
                    adults: parseInt(req.body.noOfGuests.adults),
                    children: parseInt(req.body.noOfGuests.children || 0)
                },
                noOfRooms: parseInt(req.body.noOfRooms),
                totalPrice: parseFloat(req.body.totalPrice)
            };

            // Validate required fields
            const requiredFields = [
                'roomId', 'checkInDate', 'checkOutDate', 
                'fullName', 'email', 'phone', 'totalPrice'
            ];

            for (const field of requiredFields) {
                if (!bookingData[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }

            const booking = await this.bookingService.createBooking(bookingData);
            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                booking
            });
        } catch (error: unknown) {
            console.error('Booking creation error:', error);
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error occurred' 
            });
        }
    };

    async getBooking(req: AuthRequest, res: Response): Promise<void> {
   
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
            res.json({booking,message:"Booking updated successfully"});
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
        
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
        console.log('getBookingsByUserId called with userId:', req.params.userId);
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
    }   
    
    
    async getBookingsByUserToken(req: AuthRequest, res: Response): Promise<void> {
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
            // const User = (await import('../models/User')).default;
            
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
           
            const detailedBookings = await Promise.all(bookings.map(async (booking: any) => {
                const room = await Room.findById(booking.roomId);
                // const user = await User.findById(booking.userId);
                return {
                    booking,
                    room,
                    // user
                };
            }));
            res.json(detailedBookings);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
}